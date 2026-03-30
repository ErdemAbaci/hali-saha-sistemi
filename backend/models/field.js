const mongoose = require("mongoose");
// Halı sahası modeli oluşturur. veritabanında halı sahasının bilgilerini tutar.

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const fieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    phone: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    imageUrl: { type: String },
    operatingHours: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0, min: 0 },
    reviews: [reviewSchema],
    fieldCount: { type: Number, min: 1 },
    fields: [{ type: Number, min: 1 }],
    operator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Field", fieldSchema);
