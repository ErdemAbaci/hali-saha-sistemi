const Subscription = require('../models/Subscription');
const SubscriptionPackage = require('../models/SubscriptionPackage');
const Reservation = require('../models/reservation');
const Field = require('../models/field');

// Tüm abonelik paketlerini getir
exports.getSubscriptionPackages = async (req, res) => {
    try {
        const packages = await SubscriptionPackage.find({ isActive: true });
        console.log('Dönen paketler:', packages);
        res.json(packages);
    } catch (error) {
        console.error('Paketler çekilirken hata oluştu:', error);
        res.status(500).json({ message: error.message });
    }
};

// Yeni abonelik oluştur
exports.createSubscription = async (req, res) => {
    try {
        const { userId, packageId } = req.body;

        const package = await SubscriptionPackage.findById(packageId);
        if (!package) {
            return res.status(404).json({ message: 'Paket bulunamadı' });
        }

        let finalSubscription;

        // Mevcut aktif ve bitiş tarihi henüz gelmemiş aboneliği kontrol et
        let existingSubscription = await Subscription.findOne({
            userId: userId,
            isActive: true,
            endDate: { $gt: new Date() }
        });

        if (existingSubscription) {
            // Mevcut abonelik varsa, süresini ve maç haklarını güncelle
            existingSubscription.remainingMatches += package.matchCount;
            
            // Bitiş tarihini uzat: Mevcut bitiş tarihinden itibaren yeni paketin süresi kadar ekle
            let newEndDate = new Date(existingSubscription.endDate);
            newEndDate.setMonth(newEndDate.getMonth() + package.duration);
            
            existingSubscription.endDate = newEndDate;

            finalSubscription = await existingSubscription.save();
            console.log('Mevcut abonelik güncellendi:', finalSubscription._id);

        } else {
            // Aktif abonelik yoksa, yeni abonelik oluştur
            const startDate = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + package.duration);

            const newSubscription = new Subscription({
                userId: userId,
                packageId,
                startDate,
                endDate,
                remainingMatches: package.matchCount,
                isActive: true
            });

            finalSubscription = await newSubscription.save();
            console.log('Yeni abonelik oluşturuldu:', finalSubscription._id);
        }

        res.status(201).json(finalSubscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Kullanıcının aktif aboneliğini getir (Artık req.user._id kullanacak)
exports.getUserActiveSubscription = async (req, res) => {
    try {
        const userId = req.user._id; // Token'dan kullanıcı ID'si al
        const subscription = await Subscription.findOne({
            userId: userId,
            isActive: true,
            endDate: { $gt: new Date() }
        }).populate('packageId');

        if (!subscription) {
            return res.status(404).json({ message: 'Aktif abonelik bulunamadı' });
        }

        res.json(subscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Rezervasyon sonrası maç hakkını düş
exports.decreaseRemainingMatches = async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        
        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) {
            return res.status(404).json({ message: 'Abonelik bulunamadı' });
        }

        if (subscription.remainingMatches <= 0) {
            return res.status(400).json({ message: 'Kalan maç hakkınız bulunmamaktadır' });
        }

        subscription.remainingMatches -= 1;
        await subscription.save();

        res.json(subscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Aboneliği iptal et
exports.cancelSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        const userId = req.user._id; // Token'dan kullanıcı ID'si al

        const subscription = await Subscription.findOne({ _id: subscriptionId, userId: userId });

        if (!subscription) {
            return res.status(404).json({ message: 'Abonelik bulunamadı veya bu aboneliği iptal etme yetkiniz yok.' });
        }

        subscription.isActive = false;
        subscription.cancelledAt = new Date();
        await subscription.save();

        res.status(200).json({ message: 'Abonelik başarıyla iptal edildi.' });

    } catch (error) {
        console.error('Abonelik iptal hatası:', error);
        res.status(500).json({ message: error.message });
    }
};

// Abonelik hakkını kullanarak rezervasyon oluştur
// Abonelik hakkını kullanarak rezervasyon oluştur
exports.useSubscriptionRight = async (req, res) => {
    try {
        const userId = req.user._id;
        const { halisahaId, fieldId, fieldNumber, date, hour } = req.body;

        // 1. Aktif abonelik kontrolü
        const activeSubscription = await Subscription.findOne({
            userId: userId,
            isActive: true,
            endDate: { $gt: new Date() },
            remainingMatches: { $gt: 0 }
        }).populate('packageId');

        if (!activeSubscription) {
            return res.status(400).json({ success: false, message: 'Aktif aboneliğiniz veya yeterli maç hakkınız bulunmamaktadır.' });
        }

        // 2. Saha ve müsaitlik kontrolü
        const halisaha = await Field.findById(halisahaId);
        if (!halisaha) {
            return res.status(404).json({ success: false, message: 'Halı saha bulunamadı.' });
        }

        // --- DEĞİŞİKLİK BURADA ---
        // Gelen tarihi YYYY-MM-DD formatına çeviriyoruz.
        const d = new Date(date);
        const formattedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        // --- DEĞİŞİKLİK SONU ---

        const existingReservation = await Reservation.findOne({
            field: fieldId,
            fieldNumber: Number(fieldNumber),
            date: formattedDate, // Artık formatlanmış tarih kullanılıyor
            status: { $in: ["pending", "confirmed"] }
        });

        if (existingReservation) {
            return res.status(400).json({ success: false, message: 'Seçtiğiniz saat dilimi zaten rezerve edilmiş.' });
        }

        // 3. Yeni rezervasyon oluşturma
        const newReservation = new Reservation({
            user: userId,
            field: fieldId,
            fieldNumber: parseInt(fieldNumber),
            date: formattedDate, // Formatlanmış tarihi kaydediyoruz
            hour: hour,
            amount: 0,
            paymentStatus: 'paid-by-subscription',
            status: 'confirmed',
            isCancelled: false,
        });

        await newReservation.save();

        // 4. Abonelik hakkını düşürme
        activeSubscription.remainingMatches -= 1;
        if (activeSubscription.remainingMatches === 0) {
            activeSubscription.isActive = false;
        }
        await activeSubscription.save();

        res.status(200).json({ success: true, message: 'Abonelik hakkınız başarıyla kullanıldı ve rezervasyonunuz kaydedildi.', reservation: newReservation });

    } catch (error) {
        console.error('Abonelik hakkı kullanılarak rezervasyon oluşturulurken hata oluştu:', error);
        res.status(500).json({ success: false, message: 'Rezervasyon oluşturulurken bir hata oluştu.', error: error.message });
    }
};