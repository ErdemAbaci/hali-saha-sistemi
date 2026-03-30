const { USER_ROLES } = require("../config/constants");
const { phoneSchema, z } = require("./common");

const registerSchema = z.object({
  name: z.string().trim().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z
    .string()
    .trim()
    .email("Geçerli bir email girin")
    .transform((value) => value.toLowerCase()),
  phone: phoneSchema,
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Geçerli bir email girin")
    .transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Şifre zorunludur"),
});

const createAdminSchema = z.object({
  name: z.string().trim().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z
    .string()
    .trim()
    .email("Geçerli bir email girin")
    .transform((value) => value.toLowerCase()),
  phone: phoneSchema.optional(),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  role: z.enum(USER_ROLES).optional(),
});

module.exports = {
  createAdminSchema,
  loginSchema,
  registerSchema,
};
