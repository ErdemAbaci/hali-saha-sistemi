const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");

const {
  getAllFields,
  getOperatorFields,
  getFieldById,
  createField,
  getAvailableSlots,
  updateField,
  deleteField,
  createFieldReview,
} = require("../controllers/fieldController");
const {
  availableSlotsQuerySchema,
  createFieldSchema,
  fieldIdParamsSchema,
  reviewSchema,
  updateFieldSchema,
} = require("../validators/fieldValidators");

router.get("/", getAllFields);

router.get(
  "/operator/fields",
  protect,
  authorize(["operator", "admin"]),
  getOperatorFields
);

router.post(
  "/",
  protect,
  authorize(["operator", "admin"]),
  validate(createFieldSchema),
  createField
);

router.get("/:id", validate(fieldIdParamsSchema, "params"), getFieldById);

router.get(
  "/:id/available-slots",
  validate(fieldIdParamsSchema, "params"),
  validate(availableSlotsQuerySchema, "query"),
  getAvailableSlots
);

router.put(
  "/:id",
  protect,
  authorize(["operator", "admin"]),
  validate(fieldIdParamsSchema, "params"),
  validate(updateFieldSchema),
  updateField
);

router.delete(
  "/:id",
  protect,
  authorize(["operator", "admin"]),
  validate(fieldIdParamsSchema, "params"),
  deleteField
);

router.post(
  "/:id/reviews",
  protect,
  validate(fieldIdParamsSchema, "params"),
  validate(reviewSchema),
  createFieldReview
);

module.exports = router;
