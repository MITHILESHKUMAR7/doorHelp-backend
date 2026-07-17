const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');
const logger = require('./logger/logger');

async function start() {
  await connectDB();
  app.listen(env.PORT, () => {
    logger.info(`DoorHelp backend running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
  });
}

start();
