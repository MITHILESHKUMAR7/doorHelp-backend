const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    avatarUrl: { type: String, default: null },
    skillCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    isActive: { type: Boolean, default: true },
    ratingAvg: { type: Number, default: 0 }, // denormalized from reviews
  },
  { timestamps: true },
);

technicianSchema.index({ skillCategories: 1, isActive: 1 });

module.exports = mongoose.model('Technician', technicianSchema);
