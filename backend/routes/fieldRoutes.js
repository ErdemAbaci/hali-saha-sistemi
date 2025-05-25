const express = require("express");
const router = express.Router();

const {
  getAllFields,
  getFieldById,
  createField,
  updateField,
  deleteField,
} = require("../controllers/fieldController");

// Tüm halısahaları listele
router.get("/", getAllFields);

// Halısaha ekle
router.post("/", createField);

// Tek bir halısaha detayını getir
router.get("/:id", getFieldById);

// Halısaha güncelle
router.put("/:id", updateField);

// Halısaha sil
router.delete("/:id", deleteField);

module.exports = router;
