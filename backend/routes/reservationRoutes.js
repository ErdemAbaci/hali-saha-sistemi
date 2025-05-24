const express = require("express");
const router = express.Router();
const {
  createReservation,
  cancelReservation,
  getAvailableHours,
  getUserReservations,
} = require("../controllers/reservationController");

const verifyToken = require("../middleware/verifyToken");

router.post("/", verifyToken, createReservation);
router.post("/available-hours", verifyToken, getAvailableHours);
router.patch("/:id/cancel", verifyToken, cancelReservation);
router.get("/my-reservations", verifyToken, getUserReservations);
module.exports = router;
