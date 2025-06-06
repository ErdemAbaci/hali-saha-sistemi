const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");
const User = require("../models/user");

// Kullanıcı profil bilgilerini getir
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Kullanıcı bilgilerini güncelle
router.put("/update", protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Admin paneli için kullanıcı listesi
router.get("/admin/users", protect, checkRole(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Operatör paneli için kullanıcı listesi
router.get("/operator/users", protect, checkRole(["operator", "admin"]), async (req, res) => {
  try {
    const users = await User.find({ role: "customer" }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Kullanıcı rolünü güncelle (sadece admin)
router.put("/admin/users/:id/role", protect, checkRole(["admin"]), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

module.exports = router;
