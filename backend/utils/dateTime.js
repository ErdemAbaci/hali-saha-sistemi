const normalizeDate = (dateValue) => {
  if (typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().split("T")[0];
};

const buildReservationSlotKey = ({ fieldId, fieldNumber, date, hour }) => {
  return [fieldId, Number(fieldNumber), date, hour].join(":");
};

module.exports = {
  buildReservationSlotKey,
  normalizeDate,
};
