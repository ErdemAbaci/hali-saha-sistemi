const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const SubscriptionPayment = require('../models/SubscriptionPayment');
const Subscription = require('../models/Subscription');
const SubscriptionPackage = require('../models/SubscriptionPackage');

const createSubscriptionPayment = async (req, res) => {
    try {
        const { paymentMethodId, amount, packageId } = req.body;
        const userId = req.user._id;

        console.log('Abonelik ödeme isteği başladı:', { userId, amount, packageId });

        if (!packageId) {
            return res.status(400).json({ success: false, message: 'Abonelik paketi kimliği gerekli.' });
        }

        const subscriptionPackage = await SubscriptionPackage.findById(packageId);
        if (!subscriptionPackage) {
            return res.status(404).json({ success: false, message: 'Abonelik paketi bulunamadı.' });
        }

        if (amount !== subscriptionPackage.price) {
            return res.status(400).json({ success: false, message: 'Ödeme tutarı paket fiyatıyla eşleşmiyor.' });
        }

        // Stripe ödeme işlemini başlat
        console.log('Stripe abonelik ödeme işlemi başlatılıyor...');
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'try',
            payment_method: paymentMethodId,
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            }
        });

        console.log('Stripe ödeme durumu (abonelik):', paymentIntent.status);

        if (paymentIntent.status === 'succeeded') {
            let finalSubscription;

            // Mevcut aktif ve bitiş tarihi henüz gelmemiş aboneliği kontrol et
            let existingSubscription = await Subscription.findOne({
                userId,
                isActive: true,
                endDate: { $gt: new Date() } // Sadece hala geçerli olan abonelikleri bul
            });

            if (existingSubscription) {
                // Mevcut abonelik varsa, süresini ve maç haklarını güncelle
                existingSubscription.remainingMatches += subscriptionPackage.matchCount;
                
                // Bitiş tarihini uzat: Mevcut bitiş tarihinden itibaren yeni paketin süresi kadar ekle
                // Eğer mevcut bitiş tarihi geçmişse (ki bu durumda yukarıdaki sorgu bulmaz), bugünden itibaren uzat. 
                // Ancak yukarıdaki sorgu sadece gelecekteki abonelikleri bulduğu için bu kontrol genelde gereksiz.
                let newEndDate = new Date(existingSubscription.endDate); 
                newEndDate.setMonth(newEndDate.getMonth() + subscriptionPackage.duration);
                
                existingSubscription.endDate = newEndDate;
                // Eğer paket adının da güncellenmesini isterseniz, existingSubscription.packageId = subscriptionPackage._id; ekleyebilirsiniz.
                // Ancak kullanıcı isteği sadece süre ve maç hakkı birleştirmesi yönündeydi.

                finalSubscription = await existingSubscription.save();
                console.log('Mevcut abonelik güncellendi:', finalSubscription._id);

            } else {
                // Aktif abonelik yoksa, yeni abonelik oluştur
                const startDate = new Date();
                const endDate = new Date();
                endDate.setMonth(endDate.getMonth() + subscriptionPackage.duration);

                const newSubscription = new Subscription({
                    userId,
                    packageId: subscriptionPackage._id,
                    startDate,
                    endDate,
                    remainingMatches: subscriptionPackage.matchCount,
                    isActive: true
                });

                finalSubscription = await newSubscription.save();
                console.log('Yeni abonelik oluşturuldu:', finalSubscription._id);
            }

            // Abonelik Ödeme kaydını oluştur (her zaman yeni bir ödeme kaydı oluşturulur)
            const subscriptionPayment = new SubscriptionPayment({
                user: userId,
                amount: amount,
                paymentMethodId: paymentMethodId,
                paymentIntentId: paymentIntent.id,
                status: 'succeeded',
                type: 'subscription',
                subscription: finalSubscription._id,
                packageId: subscriptionPackage._id
            });

            await subscriptionPayment.save();
            console.log('Abonelik ödeme kaydı oluşturuldu:', subscriptionPayment._id);

            return res.status(200).json({
                success: true,
                paymentId: subscriptionPayment._id,
                subscriptionId: finalSubscription._id,
                message: 'Abonelik başarıyla tamamlandı!'
            });
        } else {
            console.log('Abonelik ödeme başarısız:', paymentIntent.status);
            return res.status(400).json({
                success: false,
                message: 'Abonelik ödeme işlemi başarısız oldu',
                status: paymentIntent.status
            });
        }

    } catch (error) {
        console.error('Abonelik ödeme hatası:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Abonelik ödeme işlemi sırasında bir hata oluştu'
        });
    }
};

module.exports = {
    createSubscriptionPayment
}; 