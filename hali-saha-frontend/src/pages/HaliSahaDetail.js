import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css'; // DatePicker CSS'ini import et

import './HaliSahaDetail.css';

function HaliSahaDetail() {
  const { id } = useParams(); // URL'den halısaha ID'sini al
  const [halisaha, setHaliSaha] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedField, setSelectedField] = useState(null); // '1', '2', '3' gibi olacak
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null); // Kullanıcının seçtiği saat dilimi
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Halısaha detaylarını çek
  // İlk useEffect içinde
  useEffect(() => {
    const fetchHaliSahaDetails = async () => {
      try {
        // Bu URL'i kendi backend API'nizin endpoint'ine göre değiştirin
        const response = await axios.get(`http://localhost:5000/api/fields/${id}`);
        setHaliSaha(response.data);
        // İlk saha otomatik seçilebilir
        if (response.data.fields && response.data.fields.length > 0) {
          setSelectedField(response.data.fields[0].toString());
        }
      } catch (err) {
        setError('Halısaha detayları yüklenirken bir hata oluştu.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHaliSahaDetails();
  }, [id]);

  // 2. Seçilen tarih ve sahaya göre uygun saat dilimlerini çek
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate || !selectedField || !halisaha) {
        setAvailableTimeSlots([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
        // Bu URL'i kendi backend API'nizin endpoint'ine göre değiştirin
        const response = await axios.get(
          `http://localhost:5000/api/fields/${id}/available-slots`,
          {
            params: {
              date: formattedDate,
              fieldNumber: selectedField,
            },
          }
        );
        setAvailableTimeSlots(response.data);
      } catch (err) {
        setError('Saat dilimleri yüklenirken bir hata oluştu.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate, selectedField, halisaha, id]);

  // Field selection kısmında
  <div className="field-selection">
    <h4>Select a field:</h4>
    {halisaha.fields && halisaha.fields.map((fieldNumber) => (
      <div
        key={fieldNumber}
        className={`field-option ${selectedField === fieldNumber.toString() ? 'selected' : ''}`}
        onClick={() => handleFieldSelect(fieldNumber.toString())}
      >
        Saha {fieldNumber}
      </div>
    ))}
  </div>

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Tarih değişince seçili saati sıfırla
  };

  const handleFieldSelect = (fieldNumber) => {
    if (halisaha.fields.find(f => f.name === fieldNumber && !f.available)) {
        // Saha müsait değilse seçimi engelle
        return;
    }
    setSelectedField(fieldNumber);
    setSelectedTimeSlot(null); // Saha değişince seçili saati sıfırla
  };

  const handleTimeSlotSelect = (slot) => {
    if (!slot.booked) {
      setSelectedTimeSlot(slot.time === selectedTimeSlot ? null : slot.time); // Aynı slota tekrar tıklanırsa seçimi kaldır
    }
  };

  const handleBookClick = () => {
    if (!selectedDate || !selectedField || !selectedTimeSlot) {
      alert('Lütfen tarih, saha ve saat seçimi yapın.');
      return;
    }

    // Rezervasyon işlemini backend'e gönder
    // Bu kısım genellikle kullanıcı girişi gerektirir.
    // Eğer kullanıcı girişi yoksa, önce login sayfasına yönlendirilebilir.
    console.log({
      halisahaId: halisaha.id,
      date: selectedDate.toISOString().split('T')[0],
      field: selectedField,
      timeSlot: selectedTimeSlot,
    });

    // Örnek olarak bir rezervasyon API çağrısı:
    // axios.post('http://localhost:3001/api/reservations', {
    //   hallsahaId: hallsaha.id,
    //   date: selectedDate.toISOString().split('T')[0],
    //   field: selectedField,
    //   timeSlot: selectedTimeSlot,
    //   userId: 'current_user_id' // Giriş yapmış kullanıcının ID'si
    // })
    // .then(response => {
    //   alert('Rezervasyonunuz başarıyla oluşturuldu!');
    //   // Başarılı olursa saat dilimlerini yeniden çek veya state'i güncelle
    //   // fetchAvailableSlots();
    //   setSelectedTimeSlot(null); // Seçimi temizle
    // })
    // .catch(err => {
    //   alert('Rezervasyon oluşturulurken bir hata oluştu: ' + (err.response?.data?.message || err.message));
    //   console.error('Rezervasyon Hatası:', err);
    // });

    alert(`Rezervasyon bilgileri:
      Halısaha: ${halisaha.name}
      Tarih: ${selectedDate.toLocaleDateString()}
      Saha: ${selectedField}
      Saat: ${selectedTimeSlot}
      (Bu sadece bir demodur, gerçek rezervasyon backend'e gönderilir)
    `);
  };

  if (loading) {
    return <div className="halisaha-detail-container">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="halisaha-detail-container" style={{ color: 'red' }}>{error}</div>;
  }

  if (!halisaha) {
    return <div className="halisaha-detail-container">Halısaha bulunamadı.</div>;
  }

  return (
    <div className="halisaha-detail-container">
      <div className="halisaha-header">
        <img src={halisaha.imageUrl || 'https://via.placeholder.com/960x300?text=Halısaha'} alt={halisaha.name} className="halisaha-image" />
        <h2>{halisaha.name}</h2>
        <p>{halisaha.address}</p>
      </div>

      <div className="detail-grid">
        <div className="venue-details">
          <h3>Venue Details</h3>
          <p><strong>Operating Hours:</strong> {halisaha.operatingHours}</p>
          <p><strong>Rating:</strong> {halisaha.rating} ({halisaha.reviewsCount} reviews)</p>
          <p><strong>Available Yards:</strong> {halisaha.fieldCount}</p>
          <h4>Contact Information</h4>
          <p><strong>Phone:</strong> {halisaha.phone}</p>
          <p><strong>Email:</strong> {halisaha.email}</p>
        </div>

        <div className="reservation-section">
          <h3>Make a reservation</h3>

          <div className="date-selection">
            <h4>Select a date:</h4>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()} // Geçmiş tarihleri seçimi engeller
              inline // Takvimi her zaman gösterir
              // highlightDates={[new Date(), new Date().setDate(new Date().getDate() + 1)]} // İstersen belirli tarihleri vurgula
            />
          </div>

          <div className="field-selection">
            <h4>Select a field:</h4>
            {halisaha.fields && halisaha.fields.map((fieldNumber) => (
              <div
                key={fieldNumber}
                className={`field-option ${selectedField === fieldNumber ? 'selected' : ''}`}
                onClick={() => handleFieldSelect(fieldNumber)}
              >
                Saha {fieldNumber}
              </div>
            ))}
          </div>

          {selectedDate && selectedField && ( // Tarih ve saha seçildiyse saatleri göster
            <div className="time-slot-selection">
              <h3>Select a time slot:</h3>
              {loading ? (
                <div>Saatler yükleniyor...</div>
              ) : error ? (
                <div style={{color: 'red'}}>{error}</div>
              ) : (
                <div className="time-slots-grid">
                  {availableTimeSlots.length > 0 ? (
                    availableTimeSlots.map((slot, index) => (
                      <button
                        key={index}
                        className={`time-slot-button ${slot.booked ? 'booked' : ''} ${selectedTimeSlot === slot.time ? 'selected-slot' : ''}`}
                        disabled={slot.booked}
                        onClick={() => handleTimeSlotSelect(slot)}
                      >
                        {slot.time} {slot.booked && '(Booked)'}
                      </button>
                    ))
                  ) : (
                    <div>Bu tarih ve sahada uygun saat bulunamadı.</div>
                  )}
                </div>
              )}
            </div>
          )}

          <button
            className="login-to-book-button"
            onClick={handleBookClick}
            disabled={!selectedDate || !selectedField || !selectedTimeSlot} // Rezervasyon yapmak için hepsi seçili olmalı
          >
            Login to Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default HaliSahaDetail;