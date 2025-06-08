const express = require("express");
const router = express.Router();
const {
  createReservation,
  cancelReservation,
  getAvailableHours,
  getUserReservations,
} = require("../controllers/reservationController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createReservation);
router.post("/available-hours", protect, getAvailableHours);
router.patch("/:id/cancel", protect, cancelReservation);
router.get("/my-reservations", protect, getUserReservations);

module.exports = router;
