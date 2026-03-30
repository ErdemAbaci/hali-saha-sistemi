const express = require("express");
const router = express.Router();
const {
  createReservation,
  cancelReservation,
  getAvailableHours,
  getUserReservations,
} = require("../controllers/reservationController");

const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  availableHoursSchema,
  createReservationSchema,
  reservationIdParamsSchema,
} = require("../validators/reservationValidators");

router.post("/", protect, validate(createReservationSchema), createReservation);
router.post("/available-hours", protect, validate(availableHoursSchema), getAvailableHours);
router.patch(
  "/:id/cancel",
  protect,
  validate(reservationIdParamsSchema, "params"),
  cancelReservation
);
router.get("/my-reservations", protect, getUserReservations);

module.exports = router;
