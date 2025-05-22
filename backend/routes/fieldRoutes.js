const express = require("express");
const router = express.Router();

const {
  getAllFields,
  createField,
  updateField,
  deleteField,
} = require("../controllers/fieldController");

// Tüm halısahaları listele
router.get("/", getAllFields);

// Halısaha ekle
router.post("/", createField);

// Halısaha güncelle
router.put("/:id", updateField);

// Halısaha sil
router.delete("/:id", deleteField);

module.exports = router;
