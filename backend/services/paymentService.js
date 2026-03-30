const mongoose = require("mongoose");
const Payment = require("../models/payment");
const Field = require("../models/field");
const AppError = require("../utils/AppError");
const { createPaymentIntent, createRefund, retrievePaymentIntent } = require("../utils/stripeClient");
const reservationService = require("./reservationService");

const buildPaymentIdempotencyKey = ({ userId, fieldId, fieldNumber, date, hour }) => {
  return `reservation:${userId}:${fieldId}:${fieldNumber}:${date}:${hour}`;
};

const ensurePaymentOwner = (payment, actor) => {
  const isOwner = payment.user.toString() === actor._id.toString();
  const isAdmin = actor.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("Bu ödeme kaydına erişim yetkiniz yok", 403);
  }
};

const createReservationPayment = async ({ userId, payload }) => {
  const { paymentMethodId, amount, fieldId, fieldNumber, date, hour } = payload;
  const field = await Field.findById(fieldId);

  if (!field) {
    throw new AppError("Halı saha bulunamadı", 404);
  }

  if (Number(amount) !== Number(field.price)) {
    throw new AppError("Ödeme tutarı saha fiyatıyla eşleşmiyor.", 400);
  }

  const paymentIntent = await createPaymentIntent(
    {
      amount: Math.round(Number(field.price) * 100),
      currency: "try",
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    },
    {
      idempotencyKey: buildPaymentIdempotencyKey({
        userId,
        fieldId,
        fieldNumber,
        date,
        hour,
      }),
    }
  );

  if (paymentIntent.status !== "succeeded") {
    return {
      success: false,
      message: "Ödeme işlemi başarısız oldu",
      status: paymentIntent.status,
    };
  }

  const existingPayment = await Payment.findOne({
    paymentIntentId: paymentIntent.id,
  });

  if (existingPayment) {
    return {
      success: true,
      paymentId: existingPayment._id,
      reservationId: existingPayment.reservation,
      message: "Ödeme ve rezervasyon başarıyla tamamlandı",
    };
  }

  const session = await mongoose.startSession();
  let transactionCommitted = false;

  try {
    session.startTransaction();

    const reservation = await reservationService.createReservation(
      {
        userId,
        fieldId,
        fieldNumber,
        date,
        hour,
        status: "confirmed",
      },
      session
    );

    const payment = new Payment({
      user: userId,
      field: fieldId,
      amount: Number(field.price),
      paymentMethodId,
      paymentIntentId: paymentIntent.id,
      status: "succeeded",
      reservation: reservation._id,
      fieldNumber: Number(fieldNumber),
      date,
      hour,
    });

    await payment.save({ session });
    await session.commitTransaction();
    transactionCommitted = true;

    return {
      success: true,
      paymentId: payment._id,
      reservationId: reservation._id,
      message: "Ödeme ve rezervasyon başarıyla tamamlandı",
    };
  } catch (error) {
    await session.abortTransaction();

    if (!transactionCommitted && paymentIntent.status === "succeeded") {
      await createRefund({ payment_intent: paymentIntent.id });
    }

    throw error;
  } finally {
    session.endSession();
  }
};

const getPaymentStatus = async (paymentId, actor) => {
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new AppError("Ödeme kaydı bulunamadı", 404);
  }

  ensurePaymentOwner(payment, actor);

  const paymentIntent = await retrievePaymentIntent(payment.paymentIntentId);
  payment.status = paymentIntent.status;
  await payment.save();

  return {
    success: true,
    status: payment.status,
    paymentIntent,
  };
};

const getUserPayments = async (userId) => {
  const payments = await Payment.find({ user: userId })
    .populate("field", "name")
    .populate("reservation")
    .sort({ createdAt: -1 });

  return {
    success: true,
    payments,
  };
};

module.exports = {
  createReservationPayment,
  getPaymentStatus,
  getUserPayments,
};
