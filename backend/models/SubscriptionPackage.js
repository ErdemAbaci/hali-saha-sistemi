const mongoose = require('mongoose');

const subscriptionPackageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // Ay cinsinden süre
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    matchCount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('SubscriptionPackage', subscriptionPackageSchema); 