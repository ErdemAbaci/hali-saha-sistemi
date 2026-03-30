const asyncHandler = require("../utils/asyncHandler");
const fieldService = require("../services/fieldService");
const reservationService = require("../services/reservationService");

const getAllFields = asyncHandler(async (req, res) => {
  const fields = await fieldService.getAllFields();
  res.status(200).json(fields);
});

const getOperatorFields = asyncHandler(async (req, res) => {
  const fields = await fieldService.getOperatorFields(req.user);
  res.status(200).json(fields);
});

const createField = asyncHandler(async (req, res) => {
  const field = await fieldService.createField(req.body, req.user);
  res.status(201).json(field);
});

const updateField = asyncHandler(async (req, res) => {
  const field = await fieldService.updateField(req.params.id, req.body, req.user);
  res.status(200).json(field);
});

const deleteField = asyncHandler(async (req, res) => {
  await fieldService.deleteField(req.params.id, req.user);
  res.status(200).json({ message: "Halı saha başarıyla silindi" });
});

const getFieldById = asyncHandler(async (req, res) => {
  const field = await fieldService.getFieldById(req.params.id);
  res.status(200).json(field);
});

const getAvailableSlots = asyncHandler(async (req, res) => {
  const slots = await reservationService.getAvailableSlots({
    fieldId: req.params.id,
    date: req.query.date,
    fieldNumber: req.query.fieldNumber,
  });

  res.status(200).json(slots);
});

const createFieldReview = asyncHandler(async (req, res) => {
  const result = await fieldService.createFieldReview(
    req.params.id,
    req.user,
    req.body
  );

  res.status(201).json(result);
});

module.exports = {
  createField,
  createFieldReview,
  deleteField,
  getAllFields,
  getAvailableSlots,
  getFieldById,
  getOperatorFields,
  updateField,
};
