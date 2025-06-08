const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/payment');
const Reservation = require('../models/reservation');
const Field = require('../models/field');

// Ödeme oluşturma
const createPayment = async (req, res) => {
  try {
    const { paymentMethodId, amount, fieldId, fieldNumber, date, hour } = req.body;
    const userId = req.user._id;

    console.log('Ödeme isteği başladı:', {
      userId,
      fieldId,
      fieldNumber,
      date,
      hour
    });

    // Önce bu saat diliminde rezervasyon var mı kontrol et
    const existingReservation = await Reservation.findOne({
      field: fieldId,
      fieldNumber: fieldNumber,
      date: date,
      hour: hour,
      status: { $in: ["pending", "confirmed"] }
    });

    console.log('Mevcut rezervasyon kontrolü:', existingReservation);

    if (existingReservation) {
      console.log('Rezervasyon çakışması tespit edildi:', {
        existingReservationId: existingReservation._id,
        status: existingReservation.status
      });
      return res.status(400).json({
        success: false,
        message: 'Bu saat diliminde başka bir rezervasyon bulunmaktadır.'
      });
    }

    // Ödeme işlemini başlat
    console.log('Stripe ödeme işlemi başlatılıyor...');
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

    console.log('Stripe ödeme durumu:', paymentIntent.status);

    if (paymentIntent.status === 'succeeded') {
      // Tekrar rezervasyon kontrolü yap
      const doubleCheckReservation = await Reservation.findOne({
        field: fieldId,
        fieldNumber: fieldNumber,
        date: date,
        hour: hour,
        status: { $in: ["pending", "confirmed"] }
      });

      if (doubleCheckReservation) {
        console.log('Son kontrol: Rezervasyon çakışması tespit edildi');
        // Ödemeyi iade et
        await stripe.refunds.create({
          payment_intent: paymentIntent.id
        });
        return res.status(400).json({
          success: false,
          message: 'Bu saat diliminde başka bir rezervasyon bulunmaktadır.'
        });
      }

      // Rezervasyonu oluştur
      const reservation = new Reservation({
        user: userId,
        field: fieldId,
        fieldNumber: fieldNumber,
        date: date,
        hour: hour,
        status: 'confirmed'
      });

      const savedReservation = await reservation.save();
      console.log('Rezervasyon oluşturuldu:', savedReservation._id);

      // Ödeme kaydını oluştur
      const payment = new Payment({
        user: userId,
        field: fieldId,
        amount: amount,
        paymentMethodId: paymentMethodId,
        paymentIntentId: paymentIntent.id,
        status: 'succeeded',
        reservation: savedReservation._id,
        fieldNumber: fieldNumber,
        date: date,
        hour: hour
      });

      await payment.save();
      console.log('Ödeme kaydı oluşturuldu:', payment._id);

      return res.status(200).json({
        success: true,
        paymentId: payment._id,
        reservationId: savedReservation._id,
        message: 'Ödeme ve rezervasyon başarıyla tamamlandı'
      });
    } else {
      console.log('Ödeme başarısız:', paymentIntent.status);
      return res.status(400).json({
        success: false,
        message: 'Ödeme işlemi başarısız oldu',
        status: paymentIntent.status
      });
    }

  } catch (error) {
    console.error('Ödeme hatası:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Ödeme işlemi sırasında bir hata oluştu'
    });
  }
};

// Ödeme durumunu kontrol etme
const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Ödeme kaydı bulunamadı'
      });
    }

    // Stripe'dan güncel durumu kontrol et
    const paymentIntent = await stripe.paymentIntents.retrieve(payment.paymentIntentId);

    // Ödeme durumunu güncelle
    payment.status = paymentIntent.status;
    await payment.save();

    return res.status(200).json({
      success: true,
      status: payment.status,
      paymentIntent: paymentIntent
    });

  } catch (error) {
    console.error('Ödeme durumu kontrol hatası:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Ödeme durumu kontrol edilirken bir hata oluştu'
    });
  }
};

const getUserPayments = async (req, res) => {
  try {
    const userId = req.user._id;
    const payments = await Payment.find({ user: userId })
      .populate('field', 'name')
      .populate('reservation')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      payments: payments
    });

  } catch (error) {
    console.error('Kullanıcı ödemeleri getirme hatası:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Ödemeler getirilirken bir hata oluştu'
    });
  }
};

module.exports = {
  createPayment,
  getPaymentStatus,
  getUserPayments
}; 