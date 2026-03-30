const asyncHandler = require("../utils/asyncHandler");
const subscriptionService = require("../services/subscriptionService");

const createSubscriptionPayment = asyncHandler(async (req, res) => {
  const result = await subscriptionService.createSubscriptionPayment({
    userId: req.user._id,
    payload: req.body,
  });

  const statusCode = result.success ? 200 : 400;
  res.status(statusCode).json(result);
});

module.exports = {
  createSubscriptionPayment,
};
