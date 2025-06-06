const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware"); // For role-based authorization (imports checkRole as authorize)
const field = require("../models/field");

const {
  getAllFields,
  getFieldById,
  createField,
  getAvailableSlots,
  updateField,
  deleteField,
  createFieldReview, // Yorum ekleme fonksiyonu eklendi
} = require("../controllers/fieldController");

// Tüm halısahaları listele
router.get("/", getAllFields);

// İşletmeciye ait halı sahaları getir
router.get("/operator/fields", protect, authorize("operator", "admin"), async (req, res) => {
  try {
    // Admin tüm halı sahaları görebilir, operator sadece kendininkileri
    const query = req.user.role === "admin" ? {} : { operator: req.user._id };
    const fields = await field.find(query);
    res.status(200).json(fields);
  } catch (error) {
    res.status(500).json({ message: "İşletmeciye ait halı sahalar alınırken hata oldu", error });
  }
});

// Halısaha ekle
router.post("/", protect, authorize("operator", "admin"), createField);

// Halısaha detayı getir
router.get("/:id", getFieldById);

// Halı Saha için müsait zaman dilimlerini getir
router.get("/:id/available-slots", getAvailableSlots);

// Halısaha güncelle
router.put("/:id", protect, authorize("operator", "admin"), updateField);

// Halısaha sil
router.delete("/:id", protect, authorize("operator", "admin"), deleteField);

// Halısahaya yorum ve puan ekle
router.route("/:id/reviews").post(protect, createFieldReview);

module.exports = router;
