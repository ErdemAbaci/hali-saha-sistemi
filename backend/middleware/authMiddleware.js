const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { getEnv } = require("../config/env");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const extractBearerToken = (authorizationHeader = "") => {
  if (!authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.split(" ")[1];
};

const protect = asyncHandler(async (req, res, next) => {
  const token = extractBearerToken(req.headers.authorization || "");

  if (!token) {
    throw new AppError("Yetkilendirme başarısız: Token bulunamadı", 401);
  }

  try {
    const decoded = jwt.verify(token, getEnv().JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new AppError("Kullanıcı bulunamadı", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new AppError("Geçersiz token", 401);
    }

    if (error.name === "TokenExpiredError") {
      throw new AppError("Token süresi dolmuş", 401);
    }

    throw error;
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Yetkilendirme gerekli", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Bu işlem için yetkiniz bulunmamaktadır", 403, {
        requiredRole: roles,
        currentRole: req.user.role,
      }));
    }

    next();
  };
};

module.exports = { protect, authorize, extractBearerToken };
