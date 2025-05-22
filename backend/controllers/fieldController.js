const field = require("../models/field");

const getAllFields = async (req, res) => {
  try {
    const fields = await field.find();
    res.status(200).json(fields);
  } catch (error) {
    res.status(500).json({ message: "halısahalar alınırken hata oldu", error });
  }
};

const createField = async (req, res) => {
  try {
    const { name, location, phone, price, fields } = req.body;
    const newField = new field({ name, location, phone, price, fields });
    await newField.save();
    res.status(201).json(newField);
  } catch (error) {
    res.status(500).json({ message: "halısaha eklenirken hata oldu", error });
  }
};

const updateField = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedField = await field.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedField)
      return res.status(404).json({ message: "halısaha bulunamadı" });

    res.status(200).json(updatedField);
  } catch (error) {
    res
      .status(500)
      .json({ message: "halısaha güncellenirken hata oldu", error });
  }
};

const deleteField = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedField = await field.findByIdAndDelete(id);
    if (!deletedField)
      return res.status(404).json({ message: "halısaha bulunamadı" });
    res.status(200).json({ message: "halısaha silindi" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "halıshaa silinirken bir hata oluştu", error });
  }
};

module.exports = { getAllFields, createField, updateField, deleteField };
