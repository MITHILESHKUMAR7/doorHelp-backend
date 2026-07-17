const cartRepository = require('./cart.repository');
const serviceRepository = require('../services/service.repository');
const serviceAddonRepository = require('../services/serviceAddon.repository');
const { couponService } = require('../coupons');
const { TAX_RATE_PERCENT, DELIVERY_FEE } = require('./cart.constants');
const ApiError = require('../../common/utils/apiError');
const logger = require('../../logger/logger');

/**
 * Cart totals are ALWAYS computed here, on read — never stored on the Cart document.
 * This guarantees the "Bill Details" the user sees is never stale even if a service's price
 * changes between add-to-cart and checkout. Only booking.service.js snapshots a final locked
 * breakdown, at the moment "Place Order" is actually pressed.
 */
async function buildCartResponse(cart) {
  if (cart.items.length === 0) {
    return {
      items: [],
      appliedCoupon: null,
      priceBreakdown: { serviceTotal: 0, taxesAndFees: 0, deliveryFee: 0, discount: 0, grandTotal: 0 },
    };
  }

  const serviceIds = cart.items.map((i) => i.service);
  const allAddonIds = cart.items.flatMap((i) => i.addons.map((a) => a.addon));

  const [services, addons] = await Promise.all([
    serviceRepository.findByIds(serviceIds),
    allAddonIds.length ? serviceAddonRepository.findByIds(allAddonIds) : Promise.resolve([]),
  ]);
  const serviceMap = new Map(services.map((s) => [s._id.toString(), s]));
  const addonMap = new Map(addons.map((a) => [a._id.toString(), a]));

  let serviceTotal = 0;
  const hydratedItems = cart.items.map((item) => {
    const service = serviceMap.get(item.service.toString());
    const lineTotal = (service?.price || 0) * item.quantity;
    serviceTotal += lineTotal;

    const hydratedAddons = item.addons.map((a) => {
      const addon = addonMap.get(a.addon.toString());
      const addonTotal = (addon?.price || 0) * a.quantity;
      serviceTotal += addonTotal;
      return { addonId: a.addon, title: addon?.title, price: addon?.price, quantity: a.quantity, total: addonTotal };
    });

    return {
      serviceId: item.service,
      title: service?.title,
      price: service?.price,
      images: service?.images,
      quantity: item.quantity,
      lineTotal,
      addons: hydratedAddons,
    };
  });

  const taxesAndFees = Math.round((serviceTotal * TAX_RATE_PERCENT) / 100);

  let discount = 0;
  let couponCode = null;
  let appliedCoupon = null;

  if (cart.appliedCoupon) {
    try {
      const { coupon, discount: computedDiscount } = await couponService.validateAndComputeDiscount(
        cart.appliedCoupon.code || cart.appliedCoupon, // handles populated or raw ObjectId
        serviceTotal,
      );
      discount = computedDiscount;
      couponCode = coupon.code;
      appliedCoupon = { id: coupon._id, code: coupon.code, discount };
    } catch (err) {
      // Coupon became invalid between apply-time and now (expired, cart total dropped below minimum, etc.)
      // Silently drop it rather than blocking the whole cart read.
      logger.warn(`Cart coupon auto-removed for cart ${cart._id}: ${err.message}`);
      await cartRepository.save(Object.assign(cart, { appliedCoupon: null }));
    }
  }

  const grandTotal = Math.max(0, serviceTotal + taxesAndFees + DELIVERY_FEE - discount);

  return {
    items: hydratedItems,
    appliedCoupon,
    priceBreakdown: { serviceTotal, taxesAndFees, deliveryFee: DELIVERY_FEE, discount, couponCode, grandTotal },
  };
}

async function getCart(userId) {
  const cart = await cartRepository.findOrCreateByUser(userId);
  return buildCartResponse(cart);
}

async function addItem(userId, serviceId, quantity) {
  const service = await serviceRepository.findById(serviceId);
  if (!service || !service.isActive) {
    throw new ApiError(404, 'SERVICE_NOT_FOUND', 'Service not found');
  }

  const cart = await cartRepository.findOrCreateByUser(userId);
  const existingItem = cart.items.find((i) => i.service.toString() === serviceId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ service: serviceId, quantity, addons: [] });
  }

  await cartRepository.save(cart);
  return buildCartResponse(cart);
}

async function updateItemQuantity(userId, serviceId, quantity) {
  const cart = await cartRepository.findOrCreateByUser(userId);
  const itemIndex = cart.items.findIndex((i) => i.service.toString() === serviceId);

  if (itemIndex === -1) {
    throw new ApiError(404, 'ITEM_NOT_IN_CART', 'This service is not in your cart');
  }

  if (quantity === 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  await cartRepository.save(cart);
  return buildCartResponse(cart);
}

async function addAddonToItem(userId, serviceId, addonId, quantity) {
  const addon = await serviceAddonRepository.findById(addonId);
  if (!addon || !addon.isActive || !addon.relatedServices.some((s) => s.toString() === serviceId)) {
    throw new ApiError(400, 'ADDON_NOT_APPLICABLE', 'This addon is not available for the selected service');
  }

  const cart = await cartRepository.findOrCreateByUser(userId);
  const item = cart.items.find((i) => i.service.toString() === serviceId);
  if (!item) {
    throw new ApiError(404, 'ITEM_NOT_IN_CART', 'Add the service to your cart before adding this addon');
  }

  const existingAddon = item.addons.find((a) => a.addon.toString() === addonId);
  if (existingAddon) {
    existingAddon.quantity += quantity;
  } else {
    item.addons.push({ addon: addonId, quantity });
  }

  await cartRepository.save(cart);
  return buildCartResponse(cart);
}

async function applyCoupon(userId, code) {
  const cart = await cartRepository.findOrCreateByUser(userId);
  const { priceBreakdown } = await buildCartResponse(cart);

  if (priceBreakdown.serviceTotal === 0) {
    throw new ApiError(400, 'CART_EMPTY', 'Add items to your cart before applying a coupon');
  }

  const { coupon } = await couponService.validateAndComputeDiscount(code, priceBreakdown.serviceTotal);

  cart.appliedCoupon = coupon._id;
  await cartRepository.save(cart);
  return buildCartResponse(cart);
}

async function removeCoupon(userId) {
  const cart = await cartRepository.findOrCreateByUser(userId);
  cart.appliedCoupon = null;
  await cartRepository.save(cart);
  return buildCartResponse(cart);
}

module.exports = {
  buildCartResponse,
  getCart,
  addItem,
  updateItemQuantity,
  addAddonToItem,
  applyCoupon,
  removeCoupon,
};