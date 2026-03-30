const asyncHandler = require("../utils/asyncHandler");
const reservationService = require("../services/reservationService");

const createReservation = asyncHandler(async (req, res) => {
  const reservation = await reservationService.createReservation({
    userId: req.user._id,
    fieldId: req.body.field,
    fieldNumber: req.body.fieldNumber,
    date: req.body.date,
    hour: req.body.hour,
    status: "confirmed",
  });

  res.status(201).json({
    success: true,
    message: "Rezervasyon oluşturuldu",
    reservation,
  });
});

const getAvailableHours = asyncHandler(async (req, res) => {
  const availableHours = await reservationService.getAvailableHours({
    fieldId: req.body.field,
    fieldNumber: req.body.fieldNumber,
    date: req.body.date,
  });

  res.json({ availableHours });
});

const getUserReservations = asyncHandler(async (req, res) => {
  const reservations = await reservationService.getUserReservations(req.user._id);
  res.status(200).json({
    message: "Kullanıcının rezervasyonları",
    reservations,
  });
});

const cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await reservationService.cancelReservation(req.params.id, req.user);
  res.status(200).json({
    message: "Rezervasyon iptal edildi",
    reservation,
  });
});

module.exports = {
  cancelReservation,
  createReservation,
  getAvailableHours,
  getUserReservations,
};
