const app = require('./app');
const connectDB = require('./config/db');
const { getEnv } = require('./config/env');
const logger = require('./utils/logger');

const startServer = async () => {
  try {
    const env = getEnv();

    await connectDB();

    app.listen(env.PORT, () => {
      logger.info(`Server ${env.PORT} portunda çalışıyor`);
    });
  } catch (error) {
    logger.error('Sunucu başlatılamadı', error);
    process.exit(1);
  }
};

startServer();
