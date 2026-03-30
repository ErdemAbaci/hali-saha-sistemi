const Field = require("../models/field");
const AppError = require("../utils/AppError");
const pickAllowedFields = require("../utils/pickAllowedFields");

const FIELD_MUTABLE_FIELDS = [
  "name",
  "location",
  "address",
  "price",
  "phone",
  "email",
  "imageUrl",
  "operatingHours",
  "fieldCount",
  "fields",
];

const normalizeFieldPayload = (payload) => {
  const updates = pickAllowedFields(payload, FIELD_MUTABLE_FIELDS);

  if (Array.isArray(updates.fields)) {
    updates.fields = [...new Set(updates.fields.map((value) => Number(value)))].sort(
      (left, right) => left - right
    );
  }

  if (!updates.fields && updates.fieldCount) {
    updates.fields = Array.from({ length: Number(updates.fieldCount) }, (_, index) => index + 1);
  }

  return updates;
};

const getAllFields = async () => {
  return Field.find().sort({ createdAt: -1 });
};

const getFieldById = async (fieldId) => {
  const field = await Field.findById(fieldId);

  if (!field) {
    throw new AppError("Halısaha bulunamadı", 404);
  }

  return field;
};

const getOperatorFields = async (user) => {
  const query = user.role === "admin" ? {} : { operator: user._id };
  return Field.find(query).sort({ createdAt: -1 });
};

const createField = async (payload, user) => {
  const field = await Field.create({
    ...normalizeFieldPayload(payload),
    operator: user._id,
  });

  return field;
};

const getManagedField = async (fieldId, user) => {
  const query =
    user.role === "admin"
      ? { _id: fieldId }
      : { _id: fieldId, operator: user._id };

  const field = await Field.findOne(query);

  if (!field) {
    throw new AppError(
      "Halı saha bulunamadı veya bu işlem için yetkiniz yok",
      404
    );
  }

  return field;
};

const updateField = async (fieldId, payload, user) => {
  const existingField = await getManagedField(fieldId, user);
  const updates = normalizeFieldPayload(payload);

  Object.assign(existingField, updates);
  await existingField.save();

  return existingField;
};

const deleteField = async (fieldId, user) => {
  const field = await getManagedField(fieldId, user);
  await field.deleteOne();
};

const createFieldReview = async (fieldId, user, payload) => {
  const field = await getFieldById(fieldId);

  const alreadyReviewed = field.reviews.find(
    (review) => review.user.toString() === user._id.toString()
  );

  if (alreadyReviewed) {
    throw new AppError("Bu sahayı zaten değerlendirdiniz.", 400);
  }

  const review = {
    user: user._id,
    name: user.name,
    rating: Number(payload.rating),
    comment: payload.comment.trim(),
  };

  field.reviews.push(review);
  field.numReviews = field.reviews.length;
  field.rating =
    field.reviews.reduce((total, currentReview) => total + currentReview.rating, 0) /
    field.reviews.length;

  await field.save();

  return {
    message: "Değerlendirmeniz başarıyla eklendi.",
    review,
  };
};

module.exports = {
  createField,
  createFieldReview,
  deleteField,
  getAllFields,
  getFieldById,
  getOperatorFields,
  updateField,
};
