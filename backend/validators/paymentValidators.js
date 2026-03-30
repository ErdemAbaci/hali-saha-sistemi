const { dateSchema, hourSchema, objectIdSchema, z } = require("./common");

const createPaymentSchema = z.object({
  paymentMethodId: z.string().trim().min(1),
  amount: z.coerce.number().positive(),
  fieldId: objectIdSchema,
  fieldNumber: z.coerce.number().int().positive(),
  date: dateSchema,
  hour: hourSchema,
});

const paymentStatusParamsSchema = z.object({
  paymentId: objectIdSchema,
});

module.exports = {
  createPaymentSchema,
  paymentStatusParamsSchema,
};
