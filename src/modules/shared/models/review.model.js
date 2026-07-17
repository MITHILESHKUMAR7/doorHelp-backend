const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    // Placeholder
}, { timestamps: true });

module.exports = mongoose.model('review.model.js'.split('.')[0], schema);
