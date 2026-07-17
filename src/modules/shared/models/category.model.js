const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    iconUrl: { type: String },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }}, { timestamps: true });
schema.index({ isActive: 1, sortOrder: 1 });
module.exports = mongoose.model('Category', schema);