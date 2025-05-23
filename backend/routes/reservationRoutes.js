const express = require("express");
const router = express.Router();
const {
  createReservation,
  cancelReservation,
  getAvailableHours,
} = require("../controllers/reservationController");

router.post("/", createReservation);
router.post("/available-hours", getAvailableHours);
router.patch("/:id/cancel", cancelReservation);

module.exports = router;
