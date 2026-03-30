const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

const notFound = (req, res, next) => {
  next(new AppError(`${req.originalUrl} bulunamadı`, 404));
};

const buildMongoError = (error) => {
  if (error instanceof mongoose.Error.ValidationError) {
    return new AppError("Veri doğrulama hatası", 400, error.errors);
  }

  if (error instanceof mongoose.Error.CastError) {
    return new AppError("Geçersiz kayıt kimliği", 400);
  }

  if (error && error.code === 11000) {
    const duplicateField = Object.keys(error.keyPattern || {})[0];

    return new AppError(
      duplicateField
        ? `${duplicateField} alanı zaten kullanımda`
        : "Kayıt zaten mevcut",
      400
    );
  }

  return error;
};

const errorHandler = (error, req, res, _next) => {
  const normalizedError = buildMongoError(error);
  const statusCode = normalizedError.statusCode || 500;
  const message = normalizedError.message || "Sunucu hatası";

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} sırasında hata oluştu`, error);
  }

  res.status(statusCode).json({
    message,
    ...(normalizedError.details ? { details: normalizedError.details } : {}),
  });
};

module.exports = {
  errorHandler,
  notFound,
};
