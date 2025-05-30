const mongoose = require("mongoose");
// Halı sahası modeli oluşturur. veritabanında halı sahasının bilgilerini tutar.
const fieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    price: { type: Number, required: true },
    phone: { type: String },
    email: { type: String },
    imageUrl: { type: String },
    operatingHours: { type: String },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    fieldCount: { type: Number },
    fields: [{ type: Number }], // Örn: [1, 2, 3, 4] Halı sahası numaraları
  },
  { timestamps: true }
);

module.exports = mongoose.model("Field", fieldSchema);
