const mongoose = require('mongoose');

const serviceAddonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    icon: { type: String, default: null },
    relatedServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

serviceAddonSchema.index({ relatedServices: 1 });

module.exports = mongoose.model('ServiceAddon', serviceAddonSchema);
