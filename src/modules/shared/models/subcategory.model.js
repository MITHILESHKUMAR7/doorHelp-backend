const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false }}, { timestamps: true });
schema.index({ category: 1, slug: 1 }, { unique: true });
module.exports = mongoose.model('Subcategory', schema);