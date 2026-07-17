const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const env = require('./config/env');
const logger = require('./logger/logger');
const errorHandler = require('./middlewares/errorHandler.middleware');

// New v2.0 Routers
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(compression());
app.use(express.json());
const path = require('path');
app.use('/public', express.static(path.join(__dirname, '../public')));

app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev', { stream: { write: (msg) => logger.info(msg.trim()) } }));

app.get('/health', (req, res) => res.status(200).json({ success: true, message: 'DoorHelp API is healthy' }));

// v2.0 Architecture: Two distinct module trees
app.use('/api/v1/admin', adminRoutes); // More specific route first
app.use('/api/v1', userRoutes);

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found', code: 'NOT_FOUND' });
});

app.use(errorHandler);

module.exports = app;
