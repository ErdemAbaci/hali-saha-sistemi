// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require("./config/db");
const authRoutes = require("../backend/routes/authRoutes");


// .env dosyasını yükle
dotenv.config();

// MongoDB'ye bağlan
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// JSON gövdelerini parse etmek için middleware
app.use(express.json());

//Test endpoint
app.get('/', (req, res) => {
  res.send('API çalışıyor...');
});

//Auth Route
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor`);
});
