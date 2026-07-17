const express = require('express');
const auth = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');
const validate = require('../../middlewares/validate.middleware');
const ROLES = require('../../common/constants/roles');
const controller = require('./service.controller');
const {
  createServiceSchema,
  updateServiceSchema,
  idParamSchema,
  createAddonSchema,
  updateAddonSchema,
} = require('./service.validator');

const router = express.Router();
const adminOnly = [auth, rbac([ROLES.ADMIN, ROLES.SUPERADMIN])];

// --- Services ---
router.post('/services', ...adminOnly, validate(createServiceSchema), controller.createService);
router.patch('/services/:id', ...adminOnly, validate(updateServiceSchema), controller.updateService);
router.delete('/services/:id', ...adminOnly, validate(idParamSchema), controller.deleteService);

// --- Service Addons ---
router.get('/service-addons', ...adminOnly, controller.listAddonsAdmin);
router.post('/service-addons', ...adminOnly, validate(createAddonSchema), controller.createAddon);
router.patch('/service-addons/:id', ...adminOnly, validate(updateAddonSchema), controller.updateAddon);
router.delete('/service-addons/:id', ...adminOnly, validate(idParamSchema), controller.deleteAddon);

module.exports = router;