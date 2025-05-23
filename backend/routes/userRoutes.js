const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile", authMiddleware, (req,res) => {
    res.json({message: "Profil Bilgileri", user: req.user});

});

router.put("/update", authMiddleware, (req, res) => {
    const { name, email } = req.body;

    // Giriş yapan kullanıcının ID'si token'dan geliyor
    const userId = req.user.id;

    // Veritabanında kullanıcıyı bulup güncelle
    const User = require("../models/user");
    User.findByIdAndUpdate(
        userId,
        { name, email },
        { new: true, runValidators: true }
    )
    .then((updatedUser) => {
        res.json({
            message: "Kullanıcı bilgileri güncellendi",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });
    })
    .catch((error) => {
        res.status(500).json({ message: "Güncelleme sırasında hata oluştu", error });
    });
});


module.exports = router;