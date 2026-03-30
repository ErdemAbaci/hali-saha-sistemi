const Reservation = require("../models/reservation");
const AppError = require("../utils/AppError");
const { ACTIVE_RESERVATION_STATUSES, FIELD_AVAILABLE_SLOT_HOURS, RESERVATION_HOURS } = require("../config/constants");
const { buildReservationSlotKey } = require("../utils/dateTime");

const buildActiveReservationMatch = ({ fieldId, fieldNumber, date, hour }) => {
  const baseConditions = [
    {
      slotKey: buildReservationSlotKey({
        fieldId,
        fieldNumber,
        date,
        hour,
      }),
      activeSlot: true,
    },
    {
      field: fieldId,
      fieldNumber: Number(fieldNumber),
      date,
      hour,
      status: { $in: ACTIVE_RESERVATION_STATUSES },
    },
  ];

  return { $or: baseConditions };
};

const createReservation = async (
  { userId, fieldId, fieldNumber, date, hour, status = "confirmed" },
  session = null
) => {
  const existingReservation = await Reservation.findOne(
    buildActiveReservationMatch({ fieldId, fieldNumber, date, hour })
  ).session(session);

  if (existingReservation) {
    throw new AppError("Bu saat diliminde başka bir rezervasyon bulunmaktadır.", 400);
  }

  try {
    const reservation = new Reservation({
      user: userId,
      field: fieldId,
      fieldNumber: Number(fieldNumber),
      date,
      hour,
      status,
      activeSlot: true,
      slotKey: buildReservationSlotKey({ fieldId, fieldNumber, date, hour }),
    });

    await reservation.save({ session });
    return reservation;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError("Bu saat diliminde başka bir rezervasyon bulunmaktadır.", 400);
    }

    throw error;
  }
};

const getAvailableSlots = async ({ fieldId, date, fieldNumber }) => {
  const reservations = await Reservation.find({
    field: fieldId,
    fieldNumber: Number(fieldNumber),
    date,
    status: { $in: ACTIVE_RESERVATION_STATUSES },
  });

  const bookedHours = new Set(reservations.map((reservation) => reservation.hour));

  return FIELD_AVAILABLE_SLOT_HOURS.map((hour) => ({
    time: hour,
    booked: bookedHours.has(hour),
  }));
};

const getAvailableHours = async ({ fieldId, date, fieldNumber }) => {
  if (fieldNumber) {
    const slots = await getAvailableSlots({ fieldId, date, fieldNumber });

    return slots.filter((slot) => !slot.booked).map((slot) => slot.time);
  }

  const reservations = await Reservation.find({
    field: fieldId,
    date,
    status: { $in: ACTIVE_RESERVATION_STATUSES },
  });

  const fullHours = new Set(reservations.map((reservation) => reservation.hour));

  return RESERVATION_HOURS.filter((hour) => !fullHours.has(hour));
};

const getUserReservations = async (userId) => {
  return Reservation.find({ user: userId })
    .populate("field", "name location")
    .sort({ createdAt: -1 });
};

const cancelReservation = async (reservationId, actor) => {
  const reservation = await Reservation.findById(reservationId);

  if (!reservation) {
    throw new AppError("Rezervasyon bulunamadı", 404);
  }

  const isOwner = reservation.user.toString() === actor._id.toString();
  const isAdmin = actor.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("Bu rezervasyonu iptal etme yetkiniz yok", 403);
  }

  if (reservation.status === "cancelled") {
    throw new AppError("Rezervasyon zaten iptal edilmiş", 400);
  }

  reservation.status = "cancelled";
  reservation.activeSlot = false;

  await reservation.save();

  return reservation;
};

module.exports = {
  buildActiveReservationMatch,
  createReservation,
  getAvailableHours,
  getAvailableSlots,
  getUserReservations,
  cancelReservation,
};
