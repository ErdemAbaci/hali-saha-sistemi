const express = require('express');
const router = express.Router();
const { 
    getSubscriptionPackages, 
    createSubscription, 
    getUserActiveSubscription, 
    decreaseRemainingMatches,
    cancelSubscription,
    useSubscriptionRight
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

// Abonelik paketlerini getir
router.get('/packages', getSubscriptionPackages);

// Yeni abonelik oluştur
router.post('/', protect, createSubscription);

// Kullanıcının aktif aboneliğini getir (Artık req.user._id kullanacak)
router.get('/user', protect, getUserActiveSubscription);

// Rezervasyon sonrası maç hakkını düş
router.patch('/:subscriptionId/decrease', protect, decreaseRemainingMatches);

// Aboneliği iptal et
router.delete('/:subscriptionId', protect, cancelSubscription);

// Abonelik hakkı kullanarak rezervasyon oluştur
router.post('/use-subscription-right', protect, useSubscriptionRight);

module.exports = router; 