const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const SubscriptionPackage = require('../models/SubscriptionPackage');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const subscriptionPackages = [
    {
        name: 'Aylık Paket',
        duration: 1,
        price: 10000,
        matchCount: 10,
        description: '1 ay boyunca 10 maç hakkı',
        isActive: true
    },
    {
        name: '3 Aylık Paket',
        duration: 3,
        price: 28000,
        matchCount: 35,
        description: '3 ay boyunca 35 maç hakkı',
        isActive: true
    },
    {
        name: 'Yıllık Paket',
        duration: 12,
        price: 100000,
        matchCount: 150,
        description: '1 yıl boyunca 150 maç hakkı',
        isActive: true
    }
];

const seedSubscriptionPackages = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI tanımlı değil');
        }

        await mongoose.connect(process.env.MONGO_URI);

        for (const subscriptionPackage of subscriptionPackages) {
            await SubscriptionPackage.updateOne(
                { name: subscriptionPackage.name },
                { $set: subscriptionPackage },
                { upsert: true }
            );
        }

        console.info('Abonelik paketleri başarıyla güncellendi');
    } catch (error) {
        console.error('Seed hatası:', error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

seedSubscriptionPackages();
