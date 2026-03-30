const asyncHandler = require("../utils/asyncHandler");
const subscriptionService = require("../services/subscriptionService");

exports.getSubscriptionPackages = asyncHandler(async (req, res) => {
  const packages = await subscriptionService.getSubscriptionPackages();
  res.json(packages);
});

exports.createSubscription = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.createSubscription({
    userId: req.user._id,
    packageId: req.body.packageId,
  });

  res.status(201).json(subscription);
});

exports.getUserActiveSubscription = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.getUserActiveSubscription(req.user._id);
  res.json(subscription);
});

exports.decreaseRemainingMatches = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.decreaseRemainingMatches(
    req.params.subscriptionId,
    req.user
  );

  res.json(subscription);
});

exports.cancelSubscription = asyncHandler(async (req, res) => {
  await subscriptionService.cancelSubscription(req.params.subscriptionId, req.user);
  res.status(200).json({ message: "Abonelik başarıyla iptal edildi." });
});

exports.useSubscriptionRight = asyncHandler(async (req, res) => {
  const result = await subscriptionService.useSubscriptionRight({
    userId: req.user._id,
    payload: req.body,
  });

  res.status(200).json(result);
});
