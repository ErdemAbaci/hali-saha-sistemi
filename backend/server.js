// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("../backend/routes/authRoutes");
const userRoutes = require("../backend/routes/userRoutes");
const fieldRoutes = require("../backend/routes/fieldRoutes");

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

// JSON gövdelerini parse etmek için middleware
app.use(express.json());

//Test endpoint
app.get("/", (req, res) => {
  res.send("API çalışıyor...");
});

//Auth Route
app.use("/api/auth", authRoutes);

//field Routes
app.use("/api/fields", fieldRoutes);

//User Route
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor`);
});
