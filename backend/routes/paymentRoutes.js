const express = require("express");
const router = express.Router();
const {
  createPayment,
  getPaymentStatus,
  getUserPayments,
} = require("../controllers/paymentController");
const {
  createSubscriptionPayment,
} = require("../controllers/subscriptionPaymentController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  createPaymentSchema,
  paymentStatusParamsSchema,
} = require("../validators/paymentValidators");
const {
  createSubscriptionPaymentSchema,
} = require("../validators/subscriptionValidators");

router.post("/create", protect, validate(createPaymentSchema), createPayment);

router.post(
  "/create-subscription",
  protect,
  validate(createSubscriptionPaymentSchema),
  createSubscriptionPayment
);

router.get(
  "/status/:paymentId",
  protect,
  validate(paymentStatusParamsSchema, "params"),
  getPaymentStatus
);

router.get("/my-payments", protect, getUserPayments);

module.exports = router;
