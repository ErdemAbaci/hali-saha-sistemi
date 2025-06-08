const express = require('express');
const router = express.Router();
const { createPayment, getPaymentStatus, getUserPayments } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Ödeme oluştur
router.post('/create', protect, createPayment);

// Ödeme durumunu kontrol et
router.get('/status/:paymentId', protect, getPaymentStatus);

// Kullanıcının ödemelerini getir
router.get('/my-payments', protect, getUserPayments);

module.exports = router; 