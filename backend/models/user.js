const mongoose = require("mongoose");

// Kullanıcı modeli oluşturur. veritabanında kullanıcıların bilgilerini tutar.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "operator", "admin"],
      default: "customer",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
