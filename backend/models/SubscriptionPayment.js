const mongoose = require('mongoose');

const SubscriptionPaymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethodId: {
        type: String,
        required: true
    },
    paymentIntentId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'succeeded', 'failed', 'canceled'],
        default: 'pending'
    },
    type: {
        type: String,
        enum: ['subscription'], // Sadece abonelik ödemeleri için
        required: true,
        default: 'subscription'
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: true
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubscriptionPackage',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('SubscriptionPayment', SubscriptionPaymentSchema); 