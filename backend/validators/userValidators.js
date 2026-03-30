const { USER_ROLES } = require("../config/constants");
const { objectIdSchema, phoneSchema, z } = require("./common");

const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2).optional(),
    phone: phoneSchema.optional(),
    currentPassword: z.string().min(6).optional(),
    newPassword: z.string().min(6).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.name && !data.phone && !data.newPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message: "Güncellenecek en az bir alan gönderilmelidir",
      });
    }

    if (data.newPassword && !data.currentPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["currentPassword"],
        message: "Yeni şifre için mevcut şifre zorunludur",
      });
    }
  });

const updateUserRoleParamsSchema = z.object({
  id: objectIdSchema,
});

const updateUserRoleBodySchema = z.object({
  role: z.enum(USER_ROLES),
});

module.exports = {
  updateProfileSchema,
  updateUserRoleBodySchema,
  updateUserRoleParamsSchema,
};
