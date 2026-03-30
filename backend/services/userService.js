const bcrypt = require("bcryptjs");
const User = require("../models/user");
const AppError = require("../utils/AppError");
const pickAllowedFields = require("../utils/pickAllowedFields");

const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new AppError("Kullanıcı bulunamadı", 404);
  }

  return user;
};

const updateProfile = async (userId, payload) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("Kullanıcı bulunamadı", 404);
  }

  const updates = pickAllowedFields(payload, ["name", "phone"]);

  if (updates.phone && updates.phone !== user.phone) {
    const existingPhoneOwner = await User.findOne({
      phone: updates.phone,
      _id: { $ne: userId },
    });

    if (existingPhoneOwner) {
      throw new AppError("Bu telefon numarası zaten kayıtlı", 400);
    }
  }

  Object.assign(user, updates);

  if (payload.newPassword) {
    const passwordMatches = await bcrypt.compare(
      payload.currentPassword,
      user.password
    );

    if (!passwordMatches) {
      throw new AppError("Mevcut şifre yanlış", 400);
    }

    user.password = await bcrypt.hash(payload.newPassword, 10);
  }

  await user.save();

  return User.findById(userId).select("-password");
};

const listAllUsers = async () => {
  return User.find().select("-password").sort({ createdAt: -1 });
};

const listOperatorVisibleUsers = async () => {
  return User.find({ role: "customer" }).select("-password").sort({ createdAt: -1 });
};

const updateUserRole = async (userId, role) => {
  const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select(
    "-password"
  );

  if (!user) {
    throw new AppError("Kullanıcı bulunamadı", 404);
  }

  return user;
};

module.exports = {
  getProfile,
  listAllUsers,
  listOperatorVisibleUsers,
  updateProfile,
  updateUserRole,
};
