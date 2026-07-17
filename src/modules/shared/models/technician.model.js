const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    avatarUrl: { type: String },
    skillCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    isActive: { type: Boolean, default: true },
    ratingAvg: { type: Number, default: 0 }
}, { timestamps: true });
schema.index({ skillCategories: 1, isActive: 1 });
module.exports = mongoose.model('Technician', schema);