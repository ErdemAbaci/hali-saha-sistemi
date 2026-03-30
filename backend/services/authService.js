const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { getEnv } = require("../config/env");
const AppError = require("../utils/AppError");

const serializeUser = (userDocument) => ({
  id: userDocument._id,
  name: userDocument.name,
  email: userDocument.email,
  phone: userDocument.phone,
  role: userDocument.role,
});

const buildToken = (userDocument) => {
  return jwt.sign(
    {
      id: userDocument._id,
      role: userDocument.role,
    },
    getEnv().JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

const ensureUniqueIdentity = async ({ email, phone }) => {
  const filters = [];

  if (email) {
    filters.push({ email });
  }

  if (phone) {
    filters.push({ phone });
  }

  if (filters.length === 0) {
    return;
  }

  const existingUser = await User.findOne({ $or: filters });

  if (!existingUser) {
    return;
  }

  if (email && existingUser.email === email) {
    throw new AppError("Bu email zaten kayıtlı", 400);
  }

  if (phone && existingUser.phone === phone) {
    throw new AppError("Bu telefon numarası zaten kayıtlı", 400);
  }
};

const register = async ({ name, email, password, phone }) => {
  await ensureUniqueIdentity({ email, phone });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role: "customer",
  });

  return {
    token: buildToken(newUser),
    user: serializeUser(newUser),
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Kullanıcı bulunamadı", 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Şifre yanlış", 400);
  }

  return {
    token: buildToken(user),
    user: serializeUser(user),
  };
};

const createAdmin = async ({ name, email, password, phone }) => {
  await ensureUniqueIdentity({ email, phone });

  const hashedPassword = await bcrypt.hash(password, 10);
  const adminUser = await User.create({
    name,
    email,
    password: hashedPassword,
    phone: phone || `admin-${Date.now()}`,
    role: "admin",
  });

  return {
    message: "Admin başarıyla oluşturuldu",
    user: serializeUser(adminUser),
  };
};

module.exports = {
  createAdmin,
  login,
  register,
};
