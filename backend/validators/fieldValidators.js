const { objectIdSchema, phoneSchema, z } = require("./common");

const fieldBodySchema = z.object({
  name: z.string().trim().min(2),
  location: z.string().trim().min(2),
  address: z.string().trim().min(5),
  price: z.coerce.number().positive(),
  phone: phoneSchema.optional(),
  email: z.string().trim().email("Geçerli bir email girin").optional(),
  imageUrl: z.string().trim().url("Geçerli bir görsel URL'si girin").optional(),
  operatingHours: z.string().trim().min(3).optional(),
  fieldCount: z.coerce.number().int().positive().optional(),
  fields: z.array(z.coerce.number().int().positive()).optional(),
});

const createFieldSchema = fieldBodySchema;
const updateFieldSchema = fieldBodySchema.partial();

const fieldIdParamsSchema = z.object({
  id: objectIdSchema,
});

const availableSlotsQuerySchema = z.object({
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
  fieldNumber: z.coerce.number().int().positive(),
});

const reviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().trim().min(3).max(500),
});

module.exports = {
  availableSlotsQuerySchema,
  createFieldSchema,
  fieldIdParamsSchema,
  reviewSchema,
  updateFieldSchema,
};
