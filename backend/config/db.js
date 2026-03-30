const mongoose = require('mongoose');
const { getEnv } = require('./env');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const env = getEnv();

    await mongoose.connect(env.MONGO_URI, {
      autoIndex: env.NODE_ENV !== 'production',
    });

    logger.info('MongoDB bağlantısı başarılı');
  } catch (err) {
    logger.error('MongoDB bağlantı hatası', err);
    throw err;
  }
};

module.exports = connectDB;
