const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const SubscriptionPackage = require('../models/SubscriptionPackage');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Path to .env attempted:', path.join(__dirname, '..', '.env'));
console.log('All environment variables loaded:', process.env);

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
        await mongoose.connect(process.env.MONGO_URI);
        
        // Mevcut paketleri temizle
        await SubscriptionPackage.deleteMany({});
        
        // Yeni paketleri ekle
        await SubscriptionPackage.insertMany(subscriptionPackages);
        
        console.log('Abonelik paketleri başarıyla eklendi');
        process.exit(0);
    } catch (error) {
        console.error('Hata:', error);
        process.exit(1);
    }
};

seedSubscriptionPackages(); 