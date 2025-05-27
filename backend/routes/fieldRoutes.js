const express = require("express");
const router = express.Router();

const {
  getAllFields,
  getFieldById,
  createField,
  getAvailableSlots,
  updateField,
  deleteField,
} = require("../controllers/fieldController");

// Tüm halısahaları listele
router.get("/", getAllFields);

// Halısaha ekle
router.post("/", createField);

// Tek bir halısaha detayını getir
router.get("/:id", getFieldById);

// Halı Saha için müsait zaman dilimlerini getir
router.get("/:id/available-slots", getAvailableSlots);

// Halısaha güncelle
router.put("/:id", updateField);

// Halısaha sil
router.delete("/:id", deleteField);

module.exports = router;
