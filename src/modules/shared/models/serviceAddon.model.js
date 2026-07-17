const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    relatedServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    icon: { type: String },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }}, { timestamps: true });
schema.index({ relatedServices: 1 });
module.exports = mongoose.model('ServiceAddon', schema);