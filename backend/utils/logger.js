const { getEnv } = require("../config/env");

const shouldLogDebug = () => {
  try {
    return getEnv().NODE_ENV !== "test";
  } catch (_error) {
    return process.env.NODE_ENV !== "test";
  }
};

const formatError = (error) => {
  if (!error) {
    return "";
  }

  if (error instanceof Error) {
    return error.stack || error.message;
  }

  return error;
};

const logger = {
  info(message, meta) {
    console.info(message, meta || "");
  },

  warn(message, meta) {
    console.warn(message, meta || "");
  },

  error(message, error) {
    console.error(message, formatError(error));
  },

  debug(message, meta) {
    if (shouldLogDebug()) {
      console.debug(message, meta || "");
    }
  },
};

module.exports = logger;
