// .env dosyasını yükle
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

// server.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const verifyToken = require("./middleware/verifyToken");

//Routes
const authRoutes = require("../backend/routes/authRoutes");
const userRoutes = require("../backend/routes/userRoutes");
const fieldRoutes = require("../backend/routes/fieldRoutes");
const reservationRoutes = require("../backend/routes/reservationRoutes");
const paymentRoutes = require('../backend/routes/paymentRoutes');

// MongoDB'ye bağlan
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} geldi`);
  next();
});

// CORS ayarları
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

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
app.use("/api/users", userRoutes);

//Payment Route
app.use('/api/payments', paymentRoutes);

// Production'da aktif edilecek
// app.use(express.static(path.join(__dirname, '../hali-saha-frontend/build')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../hali-saha-frontend/build', 'index.html'));
// });

app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor`);
});