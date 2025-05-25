const field = require("../models/field");
const Reservation = require("../models/reservation");

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

const getFieldById = async (req, res) => {
  try {
    const { id } = req.params;
    const fieldData = await field.findById(id);
    if (!fieldData) {
      return res.status(404).json({ message: "Halısaha bulunamadı" });
    }
    res.status(200).json(fieldData);
  } catch (error) {
    res.status(500).json({ message: "Halısaha detayları alınırken hata oluştu", error });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const { id } = req.params; // Halı saha id'si
    const { date, fieldNumber } = req.query; // Tarih ve saha numarası

    const allSlots = [
      "09:00", "10:00", "11:00", "12:00", "13:00",
      "14:00", "15:00", "16:00", "17:00", "18:00",
      "19:00", "20:00", "21:00", "22:00"
    ];

    // O gün, o saha ve saha numarası için yapılan rezervasyonları bul
    const reservations = await Reservation.find({
      field: id,
      fieldNumber: Number(fieldNumber),
      date: date,
      status: { $in: ["pending", "confirmed"] }
    });

    const bookedSlots = reservations.map(r => r.hour);

    const availableSlots = allSlots.map(slot => ({
      time: slot,
      booked: bookedSlots.includes(slot)
    }));

    res.status(200).json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: "Müsait zaman dilimleri alınırken hata oldu", error });
  }
};

module.exports = { getAllFields, createField, updateField, deleteField, getFieldById, getAvailableSlots};
