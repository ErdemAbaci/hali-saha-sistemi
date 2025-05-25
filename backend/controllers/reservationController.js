const Reservation = require("../models/reservation");

// Rezervasyon oluşturma
async function createReservation(req, res) {
  try {
    const { user, field, fieldNumber, date, hour } = req.body;

    const controls = await Reservation.findOne({
      field,
      fieldNumber,
      date,
      hour,
      status: { $in: ["pending", "confirmed"] },
    });

    if (controls) {
      return res
        .status(400)
        .json({ message: "Bu saat diliminde rezervasyon mevcut" });
    }

    const newReservation = new Reservation({
      user,
      field,
      fieldNumber,
      date,
      hour,
      status: "pending",
    });
    await newReservation.save();

    res.status(201).json({
      message: "Rezervasyon oluşturuldu",
      reservation: newReservation,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Sunucu hatası, lütfen daha sonra tekrar deneyin." });
  }
}

// Uygun saatleri getir
async function getAvailableHours(req, res) {
  try {
    const { field, date } = req.body;

    const reservations = await Reservation.find({
      field,
      date,
      status: { $in: ["pending", "confirmed"] },
    });

    const fullHours = reservations.map((r) => r.hour);

    const allHours = [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
      "23:00",
      "00:00",
    ];

    const availableHours = allHours.filter((hour) => !fullHours.includes(hour));

    res.json({ availableHours });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Sunucu hatası, lütfen daha sonra tekrar deneyin." });
  }
}

// Kullanıcının rezervasyonlarını getir
async function getUserReservations(req,res){
  try{
    const userId = req.user.id;

    const reservations = await Reservation.find({user:userId})
    .populate("field","name locaiton")
    .sort({createdAt:"desc"});
    res.status(200).json({
      message:"Kullanıcının rezervasyonları",
      reservations
    })
  }catch(error){
    console.error(error);
    res.status(500).json({
      message:"Sunucu hatası, lütfen daha sonra tekrar deneyin."
    });

  }

}

// Rezervasyon iptali
async function cancelReservation(req, res) {
  try {
    const reservationId = req.params.id;

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Rezervasyon bulunamadı" });
    }

    if (reservation.status === "cancelled") {
      return res
        .status(400)
        .json({ message: "Rezervasyon zaten iptal edilmiş" });
    }

    reservation.status = "cancelled";
    await reservation.save();

    res.status(200).json({
      message: "Rezervasyon iptal edildi",
      reservation,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Sunucu hatası, lütfen daha sonra tekrar deneyin." });
  }
}

// Exportlar
module.exports = {
  createReservation,
  getAvailableHours,
  getUserReservations,
  cancelReservation,
};
