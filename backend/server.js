// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// .env dosyasını yükle
dotenv.config();

// MongoDB'ye bağlan
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('API çalışıyor...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor`);
});
