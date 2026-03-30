const mongoose = require("mongoose");
const Subscription = require("../models/Subscription");
const SubscriptionPackage = require("../models/SubscriptionPackage");
const SubscriptionPayment = require("../models/SubscriptionPayment");
const Field = require("../models/field");
const AppError = require("../utils/AppError");
const { createPaymentIntent, createRefund } = require("../utils/stripeClient");
const reservationService = require("./reservationService");

const getActiveSubscriptionQuery = (userId) => ({
  userId,
  isActive: true,
  endDate: { $gt: new Date() },
});

const extendSubscription = async ({ userId, packageDocument, session = null }) => {
  let subscription = await Subscription.findOne(
    getActiveSubscriptionQuery(userId)
  ).session(session);

  if (subscription) {
    const nextEndDate = new Date(subscription.endDate);
    nextEndDate.setMonth(nextEndDate.getMonth() + packageDocument.duration);

    subscription.packageId = packageDocument._id;
    subscription.remainingMatches += packageDocument.matchCount;
    subscription.endDate = nextEndDate;

    await subscription.save({ session });
    return subscription;
  }

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + packageDocument.duration);

  subscription = new Subscription({
    userId,
    packageId: packageDocument._id,
    startDate,
    endDate,
    remainingMatches: packageDocument.matchCount,
    isActive: true,
  });

  await subscription.save({ session });
  return subscription;
};

const getSubscriptionPackageOrThrow = async (packageId) => {
  const packageDocument = await SubscriptionPackage.findById(packageId);

  if (!packageDocument) {
    throw new AppError("Paket bulunamadı", 404);
  }

  return packageDocument;
};

const getSubscriptionPackages = async () => {
  return SubscriptionPackage.find({ isActive: true }).sort({ price: 1 });
};

const createSubscription = async ({ userId, packageId }) => {
  const packageDocument = await getSubscriptionPackageOrThrow(packageId);
  return extendSubscription({ userId, packageDocument });
};

const getUserActiveSubscription = async (userId) => {
  const subscription = await Subscription.findOne(
    getActiveSubscriptionQuery(userId)
  ).populate("packageId");

  if (!subscription) {
    throw new AppError("Aktif abonelik bulunamadı", 404);
  }

  return subscription;
};

const getOwnedSubscription = async (subscriptionId, actor, session = null) => {
  const query =
    actor.role === "admin"
      ? { _id: subscriptionId }
      : { _id: subscriptionId, userId: actor._id };

  const subscription = await Subscription.findOne(query).session(session);

  if (!subscription) {
    throw new AppError(
      "Abonelik bulunamadı veya bu işlem için yetkiniz yok.",
      404
    );
  }

  return subscription;
};

const decreaseRemainingMatches = async (subscriptionId, actor) => {
  const subscription = await getOwnedSubscription(subscriptionId, actor);

  if (subscription.remainingMatches <= 0) {
    throw new AppError("Kalan maç hakkınız bulunmamaktadır", 400);
  }

  subscription.remainingMatches -= 1;

  if (subscription.remainingMatches === 0) {
    subscription.isActive = false;
  }

  await subscription.save();
  return subscription;
};

const cancelSubscription = async (subscriptionId, actor) => {
  const subscription = await getOwnedSubscription(subscriptionId, actor);

  subscription.isActive = false;
  subscription.cancelledAt = new Date();
  await subscription.save();
};

const createSubscriptionPayment = async ({ userId, payload }) => {
  const { paymentMethodId, amount, packageId } = payload;
  const packageDocument = await getSubscriptionPackageOrThrow(packageId);

  if (Number(amount) !== Number(packageDocument.price)) {
    throw new AppError("Ödeme tutarı paket fiyatıyla eşleşmiyor.", 400);
  }

  const paymentIntent = await createPaymentIntent({
    amount: Math.round(Number(packageDocument.price) * 100),
    currency: "try",
    payment_method: paymentMethodId,
    confirm: true,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
  });

  if (paymentIntent.status !== "succeeded") {
    return {
      success: false,
      message: "Abonelik ödeme işlemi başarısız oldu",
      status: paymentIntent.status,
    };
  }

  const existingPayment = await SubscriptionPayment.findOne({
    paymentIntentId: paymentIntent.id,
  });

  if (existingPayment) {
    return {
      success: true,
      paymentId: existingPayment._id,
      subscriptionId: existingPayment.subscription,
      message: "Abonelik başarıyla tamamlandı!",
    };
  }

  const session = await mongoose.startSession();
  let transactionCommitted = false;

  try {
    session.startTransaction();

    const subscription = await extendSubscription({
      userId,
      packageDocument,
      session,
    });

    const subscriptionPayment = new SubscriptionPayment({
      user: userId,
      amount: Number(packageDocument.price),
      paymentMethodId,
      paymentIntentId: paymentIntent.id,
      status: "succeeded",
      type: "subscription",
      subscription: subscription._id,
      packageId: packageDocument._id,
    });

    await subscriptionPayment.save({ session });
    await session.commitTransaction();
    transactionCommitted = true;

    return {
      success: true,
      paymentId: subscriptionPayment._id,
      subscriptionId: subscription._id,
      message: "Abonelik başarıyla tamamlandı!",
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

const useSubscriptionRight = async ({ userId, payload }) => {
  const { halisahaId, fieldId, fieldNumber, date, hour } = payload;

  if (halisahaId && halisahaId !== fieldId) {
    throw new AppError("Halı saha bilgisi uyuşmuyor.", 400);
  }

  const field = await Field.findById(fieldId);

  if (!field) {
    throw new AppError("Halı saha bulunamadı.", 404);
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const activeSubscription = await Subscription.findOne({
      ...getActiveSubscriptionQuery(userId),
      remainingMatches: { $gt: 0 },
    }).session(session);

    if (!activeSubscription) {
      throw new AppError(
        "Aktif aboneliğiniz veya yeterli maç hakkınız bulunmamaktadır.",
        400
      );
    }

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

    activeSubscription.remainingMatches -= 1;

    if (activeSubscription.remainingMatches === 0) {
      activeSubscription.isActive = false;
    }

    await activeSubscription.save({ session });
    await session.commitTransaction();

    return {
      success: true,
      message:
        "Abonelik hakkınız başarıyla kullanıldı ve rezervasyonunuz kaydedildi.",
      reservation,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = {
  cancelSubscription,
  createSubscription,
  createSubscriptionPayment,
  decreaseRemainingMatches,
  getSubscriptionPackages,
  getUserActiveSubscription,
  useSubscriptionRight,
};
