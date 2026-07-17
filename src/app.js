const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const env = require('./config/env');
const logger = require('./logger/logger');
const errorHandler = require('./middlewares/errorHandler.middleware');
const authRoutes = require('./modules/auth');
const categoriesModule = require('./modules/categories');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev', { stream: { write: (msg) => logger.info(msg.trim()) } }));

app.get('/health', (req, res) => res.status(200).json({ success: true, message: 'DoorHelp API is healthy' }));

// Feature module routers mount here, one line per module (next: services, cart, bookings...)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoriesModule.publicRouter);
app.use('/api/v1/admin', categoriesModule.adminRouter);

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found', code: 'NOT_FOUND' });
});

app.use(errorHandler);

module.exports = app;
