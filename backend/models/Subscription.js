const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubscriptionPackage',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    remainingMatches: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    cancelledAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema); 
