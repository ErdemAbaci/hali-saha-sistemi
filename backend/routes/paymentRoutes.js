const express = require('express');
const router = express.Router();
const { createPayment, getPaymentStatus, getUserPayments } = require('../controllers/paymentController');
const { createSubscriptionPayment } = require('../controllers/subscriptionPaymentController');
const { protect } = require('../middleware/authMiddleware');

// Ödeme oluştur (Rezervasyon için)
router.post('/create', protect, createPayment);

// Abonelik ödemesi oluştur
router.post('/create-subscription', protect, (req, res, next) => {
    console.log('--> /api/payments/create-subscription rotası tetiklendi.');
    next();
}, createSubscriptionPayment);

// Ödeme durumunu kontrol et
router.get('/status/:paymentId', protect, getPaymentStatus);

// Kullanıcının ödemelerini getir
router.get('/my-payments', protect, getUserPayments);

module.exports = router; 