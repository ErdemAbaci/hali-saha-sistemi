const { z } = require("zod");

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Geçersiz kimlik");

const dateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir tarih girin (YYYY-MM-DD)");

const hourSchema = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Geçerli bir saat girin (HH:mm)");

const phoneSchema = z
  .string()
  .trim()
  .min(10, "Telefon numarası en az 10 karakter olmalıdır")
  .max(20, "Telefon numarası en fazla 20 karakter olabilir");

module.exports = {
  dateSchema,
  hourSchema,
  objectIdSchema,
  phoneSchema,
  z,
};
