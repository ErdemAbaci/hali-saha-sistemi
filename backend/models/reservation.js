const mongoose = require("mongoose");
// Rezervasyon modeli oluşturur. veritabanında rezervasyonların bilgilerini tutar.
const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    field: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
      required: true,
    },
    fieldNumber: { type: Number, required: true },
    date: { type: String, required: true },
    hour: { type: String, required: true },
    slotKey: { type: String, required: true },
    activeSlot: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

reservationSchema.index(
  { slotKey: 1 },
  {
    unique: true,
    partialFilterExpression: { activeSlot: true },
  }
);

reservationSchema.index({ field: 1, fieldNumber: 1, date: 1, status: 1 });

module.exports = mongoose.model("Reservation", reservationSchema);
