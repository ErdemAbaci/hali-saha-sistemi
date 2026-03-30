const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const DEFAULT_CLIENT_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
];

let cachedEnv;

const parseOrigins = (value) => {
  if (!value) {
    return DEFAULT_CLIENT_ORIGINS;
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const getEnv = () => {
  if (cachedEnv) {
    return cachedEnv;
  }

  const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: Number(process.env.PORT) || 5000,
    MONGO_URI: process.env.MONGO_URI || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
    CLIENT_ORIGINS: parseOrigins(process.env.CLIENT_ORIGINS),
  };

  const missing = ["MONGO_URI", "JWT_SECRET", "STRIPE_SECRET_KEY"].filter(
    (key) => !env[key]
  );

  if (missing.length > 0) {
    throw new Error(
      `Eksik ortam değişkenleri: ${missing.join(", ")}`
    );
  }

  cachedEnv = env;
  return env;
};

module.exports = {
  DEFAULT_CLIENT_ORIGINS,
  getEnv,
};
