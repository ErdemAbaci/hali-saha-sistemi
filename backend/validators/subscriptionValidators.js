const { dateSchema, hourSchema, objectIdSchema, z } = require("./common");

const createSubscriptionSchema = z.object({
  packageId: objectIdSchema,
  userId: objectIdSchema.optional(),
});

const subscriptionIdParamsSchema = z.object({
  subscriptionId: objectIdSchema,
});

const createSubscriptionPaymentSchema = z.object({
  paymentMethodId: z.string().trim().min(1),
  amount: z.coerce.number().positive(),
  packageId: objectIdSchema,
});

const useSubscriptionRightSchema = z.object({
  halisahaId: objectIdSchema.optional(),
  fieldId: objectIdSchema,
  fieldNumber: z.coerce.number().int().positive(),
  date: dateSchema,
  hour: hourSchema,
});

module.exports = {
  createSubscriptionPaymentSchema,
  createSubscriptionSchema,
  subscriptionIdParamsSchema,
  useSubscriptionRightSchema,
};
