const { dateSchema, hourSchema, objectIdSchema, z } = require("./common");

const createReservationSchema = z.object({
  field: objectIdSchema,
  fieldNumber: z.coerce.number().int().positive(),
  date: dateSchema,
  hour: hourSchema,
  paymentId: objectIdSchema.optional(),
});

const availableHoursSchema = z.object({
  field: objectIdSchema,
  fieldNumber: z.coerce.number().int().positive().optional(),
  date: dateSchema,
});

const reservationIdParamsSchema = z.object({
  id: objectIdSchema,
});

module.exports = {
  availableHoursSchema,
  createReservationSchema,
  reservationIdParamsSchema,
};
