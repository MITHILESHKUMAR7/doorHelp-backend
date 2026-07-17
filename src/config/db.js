const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../logger/logger');

async function connectDB() {
  try {
    await mongoose.connect(env.MONGO_URI);
    require('./registerModels'); // eslint-disable-line global-require
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error(`MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;
