const mongoose = require("mongoose");
// Halı sahası modeli oluşturur. veritabanında halı sahasının bilgilerini tutar.

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true }, // Kullanıcının adı, yorumla birlikte göstermek için
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

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
    numReviews: { type: Number, default: 0 }, // reviewsCount -> numReviews olarak güncellendi
    reviews: [reviewSchema],
    fieldCount: { type: Number },
    fields: [{ type: Number }], // Örn: [1, 2, 3, 4] Halı sahası numaraları
    operator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // İşletmeci referansı
  },
  { timestamps: true }
);

module.exports = mongoose.model("Field", fieldSchema);
