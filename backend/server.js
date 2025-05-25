// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const verifyToken = require("./middleware/verifyToken");

//Routes
const authRoutes = require("../backend/routes/authRoutes");
const userRoutes = require("../backend/routes/userRoutes");
const fieldRoutes = require("../backend/routes/fieldRoutes");
const reservationRoutes = require("../backend/routes/reservationRoutes");
const path = require("path");

// .env dosyasını yükle
dotenv.config();

// MongoDB'ye bağlan
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} geldi`);
  next();
});

// Frontend kodlarını serve etmek için middleware
app.use(express.static(path.join(__dirname, "../frontend")));

// JSON gövdelerini parse etmek için middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Test endpoint
app.get("/", (req, res) => {
  res.send("API çalışıyor...");
});

//reservation Routes
app.use("/api/reservations", reservationRoutes);

//Auth Route
app.use("/api/auth", authRoutes);

//field Routes
app.use("/api/fields", fieldRoutes);

//User Route
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor`);
});