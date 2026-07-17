const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String },
    longDescription: { type: String },
    images: { type: [String] },
    price: { type: Number, required: true },
    strikePrice: { type: Number },
    durationLabel: { type: String },
    isEcoFriendly: { type: Boolean, default: false },
    inclusions: [{ title: String, description: String, icon: String }],
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    isBestSeller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
schema.index({ category: 1, subcategory: 1, isActive: 1 });
schema.index({ title: 'text', shortDescription: 'text' });
module.exports = mongoose.model('Service', schema);