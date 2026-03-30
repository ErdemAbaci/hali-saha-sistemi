const express = require("express");
const cors = require("cors");
const { getEnv } = require("./config/env");
const logger = require("./utils/logger");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const fieldRoutes = require("./routes/fieldRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

const env = getEnv();
const app = express();

app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.originalUrl} isteği geldi`);
  next();
});

app.use(
  cors({
    origin: env.CLIENT_ORIGINS,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API çalışıyor...");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
