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
    const { name, location, address, price, phone, email, imageUrl, operatingHours, fieldCount, fields } = req.body;
    
    // İşletmeci ID'sini request'ten al
    const operatorId = req.user._id;

    const newField = new field({
      name,
      location,
      address,
      price,
      phone,
      email,
      imageUrl,
      operatingHours,
      fieldCount,
      fields,
      operator: operatorId // İşletmeci ID'sini ekle
    });

    const savedField = await newField.save();
    res.status(201).json(savedField);
  } catch (error) {
    res.status(500).json({ message: "halısaha oluşturulurken hata oldu", error });
  }
};

const updateField = async (req, res) => {
  try {
    const { id } = req.params;
    const operatorId = req.user._id;
    const isAdmin = req.user.role === "admin";

    // Admin tüm halı sahaları yönetebilir, operator sadece kendininkileri
    const query = isAdmin ? { _id: id } : { _id: id, operator: operatorId };
    const fieldToUpdate = await field.findOne(query);
    
    if (!fieldToUpdate) {
      return res.status(404).json({ message: "Halı saha bulunamadı veya bu işlem için yetkiniz yok" });
    }

    const updatedField = await field.findByIdAndUpdate(
      id,
      { ...req.body, operator: isAdmin ? fieldToUpdate.operator : operatorId },
      { new: true }
    );
    res.status(200).json(updatedField);
  } catch (error) {
    res.status(500).json({ message: "Halı saha güncellenirken hata oluştu", error });
  }
};

const deleteField = async (req, res) => {
  try {
    const { id } = req.params;
    const operatorId = req.user._id;
    const isAdmin = req.user.role === "admin";

    // Admin tüm halı sahaları silebilir, operator sadece kendininkileri
    const query = isAdmin ? { _id: id } : { _id: id, operator: operatorId };
    const fieldToDelete = await field.findOne(query);
    
    if (!fieldToDelete) {
      return res.status(404).json({ message: "Halı saha bulunamadı veya bu işlem için yetkiniz yok" });
    }

    const deletedField = await field.findByIdAndDelete(id);
    res.status(200).json({ message: "Halı saha başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Halı saha silinirken hata oluştu", error });
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

    if (!date || !fieldNumber) {
      return res.status(400).json({ message: "Tarih ve saha numarası gereklidir" });
    }

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

const createFieldReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { id: fieldId } = req.params;

  if (!rating || !comment) {
    return res.status(400).json({ message: 'Puan ve yorum alanları zorunludur.' });
  }

  try {
    const fieldToReview = await field.findById(fieldId);

    if (fieldToReview) {
      const alreadyReviewed = fieldToReview.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Bu sahayı zaten değerlendirdiniz.' });
      }

      const review = {
        user: req.user._id,
        name: req.user.name, // Assuming req.user has a 'name' field
        rating: Number(rating),
        comment,
      };

      fieldToReview.reviews.push(review);
      fieldToReview.numReviews = fieldToReview.reviews.length;
      fieldToReview.rating =
        fieldToReview.reviews.reduce((acc, item) => item.rating + acc, 0) /
        fieldToReview.reviews.length;

      await fieldToReview.save();
      res.status(201).json({ message: 'Değerlendirmeniz başarıyla eklendi.', review });
    } else {
      res.status(404).json({ message: 'Halı saha bulunamadı.' });
    }
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Değerlendirme eklenirken bir sunucu hatası oluştu.', error: error.message });
  }
};

module.exports = { getAllFields, createField, updateField, deleteField, getFieldById, getAvailableSlots, createFieldReview };
