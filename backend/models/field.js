const mongoose = require('mongoose');
// Halı sahası modeli oluşturur. veritabanında halı sahasının bilgilerini tutar.
const fieldSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String },
    fields: [{ type: Number }], // Örn: [1, 2, 3, 4] Halı sahası numaraları
  }, { timestamps: true });


module.exports = mongoose.model('Field', fieldSchema);



