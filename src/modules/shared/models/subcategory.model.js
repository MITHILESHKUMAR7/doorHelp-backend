const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    // Placeholder
}, { timestamps: true });

module.exports = mongoose.model('subcategory.model.js'.split('.')[0], schema);
