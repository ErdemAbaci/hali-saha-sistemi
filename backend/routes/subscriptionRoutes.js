const express = require("express");
const router = express.Router();
const {
  getSubscriptionPackages,
  createSubscription,
  getUserActiveSubscription,
  decreaseRemainingMatches,
  cancelSubscription,
  useSubscriptionRight,
} = require("../controllers/subscriptionController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  createSubscriptionSchema,
  subscriptionIdParamsSchema,
  useSubscriptionRightSchema,
} = require("../validators/subscriptionValidators");

router.get("/packages", getSubscriptionPackages);

router.post("/", protect, validate(createSubscriptionSchema), createSubscription);

router.get("/user", protect, getUserActiveSubscription);

router.patch(
  "/:subscriptionId/decrease",
  protect,
  validate(subscriptionIdParamsSchema, "params"),
  decreaseRemainingMatches
);

router.delete(
  "/:subscriptionId",
  protect,
  validate(subscriptionIdParamsSchema, "params"),
  cancelSubscription
);

router.post(
  "/use-subscription-right",
  protect,
  validate(useSubscriptionRightSchema),
  useSubscriptionRight
);

module.exports = router;
