const asyncHandler = require("../utils/asyncHandler");
const paymentService = require("../services/paymentService");

const createPayment = asyncHandler(async (req, res) => {
  const result = await paymentService.createReservationPayment({
    userId: req.user._id,
    payload: req.body,
  });

  const statusCode = result.success ? 200 : 400;
  res.status(statusCode).json(result);
});

const getPaymentStatus = asyncHandler(async (req, res) => {
  const result = await paymentService.getPaymentStatus(req.params.paymentId, req.user);
  res.status(200).json(result);
});

const getUserPayments = asyncHandler(async (req, res) => {
  const result = await paymentService.getUserPayments(req.user._id);
  res.status(200).json(result);
});

module.exports = {
  createPayment,
  getPaymentStatus,
  getUserPayments,
};
