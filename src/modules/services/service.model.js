const mongoose = require('mongoose');

const inclusionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: null },
  },
  { _id: false },
);

const serviceSchema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', default: null },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, default: '' },
    longDescription: { type: String, default: '' },
    images: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
    strikePrice: { type: Number, default: null },
    durationLabel: { type: String, default: '' }, // e.g. "3-4 Hours"
    isEcoFriendly: { type: Boolean, default: false },
    inclusions: { type: [inclusionSchema], default: [] },
    ratingAvg: { type: Number, default: 0 }, // denormalized, recomputed on new review
    ratingCount: { type: Number, default: 0 },
    isBestSeller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

serviceSchema.index({ category: 1, subcategory: 1, isActive: 1 });
serviceSchema.index({ title: 'text', shortDescription: 'text' });

module.exports = mongoose.model('Service', serviceSchema);
