import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, Star, Calendar, ArrowLeft, Loader2, AlertCircle, CheckCircle, X } from 'lucide-react';

// Import animations
import { fadeIn, slideIn, staggerContainer } from '../utils/animations';

// Import styles
import 'react-datepicker/dist/react-datepicker.css'; // DatePicker CSS'ini import et
import './HaliSahaDetail.css';

function HaliSahaDetail() {
  const { id } = useParams(); // URL'den halısaha ID'sini al
  const navigate = useNavigate(); // navigate hookunu kullanmak için

  // State management
  const [halisaha, setHaliSaha] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedField, setSelectedField] = useState('1'); // '1', '2', '3' gibi olacak
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null); // Kullanıcının seçtiği saat dilimi
  const [loading, setLoading] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Kullanıcı giriş durumu state'i
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Mock images for the gallery
  const [galleryImages] = useState([
    'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1605&q=80',
    'https://images.unsplash.com/photo-1579952363872-0d7e3ecee5a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  ]);

  // Kullanıcı giriş yapmış mı kontrol et
  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    setIsLoggedIn(!!userToken); // token varsa true, yoksa false
  }, []);

  // 1. Halısaha detaylarını çek
  useEffect(() => {
    const fetchHaliSahaDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/fields/${id}`);
        setHaliSaha(response.data);
        // İlk saha otomatik seçilebilir
        if (response.data && response.data.fields && response.data.fields.length > 0) {
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

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Tarih değişince seçili saati sıfırla
  };

  const handleFieldSelect = (fieldNumber) => {
    // if (halisaha && halisaha.fields && halisaha.fields.find(f => f === fieldNumber && !f.available)) {
    //     // Saha müsait değilse seçimi engelle
    //     return;
    // }
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

    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (!isLoggedIn) {
      alert('Rezervasyon yapmak için giriş yapmalısınız.');
      navigate('/login');
      return;
    }

    // Rezervasyon işlemini backend'e gönder
    console.log({
      halisahaId: halisaha.id,
      date: selectedDate.toISOString().split('T')[0],
      field: selectedField,
      timeSlot: selectedTimeSlot,
    });

    alert(`Rezervasyon bilgileri:
      Halısaha: ${halisaha.name}
      Tarih: ${selectedDate.toLocaleDateString()}
      Saha: ${selectedField}
      Saat: ${selectedTimeSlot}
      (Bu sadece bir demodur, gerçek rezervasyon backend'e gönderilir)
    `);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-700">Halı saha bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Bir Hata Oluştu</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!halisaha) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden p-6 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Halı Saha Bulunamadı</h2>
          <p className="text-gray-600 mb-6">Aradığınız halı saha bulunamadı veya erişilemiyor.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial="hidden"
      animate="show"
      variants={staggerContainer}
    >
      {/* Header with Back Button */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span>Geri Dön</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Venue Header */}
        <motion.div variants={fadeIn('up', 'tween', 0.2, 1)} className="mb-8">
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-6">
            <img
              src={galleryImages[0]}
              alt={halisaha.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.floor(halisaha.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-2 text-sm text-white/90">({halisaha.reviewsCount} değerlendirme)</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">{halisaha.name}</h1>
              <div className="flex items-center text-white/90 mt-2">
                <MapPin className="w-5 h-5 mr-1.5 flex-shrink-0" />
                <span>{halisaha.address}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Venue Details */}
          <motion.div 
            variants={fadeIn('right', 'tween', 0.2, 1)}
            className="lg:col-span-2 space-y-8"
          >
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Hakkında</h2>
              <p className="text-gray-600 mb-6">{halisaha.description || 'Bu halı saha hakkında detaylı bilgi bulunmamaktadır.'}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">İletişim Bilgileri</h3>
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Telefon</p>
                      <a href={`tel:${halisaha.phone}`} className="text-gray-900 hover:text-green-600 transition-colors">
                        {halisaha.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">E-posta</p>
                      <a href={`mailto:${halisaha.email}`} className="text-gray-900 hover:text-green-600 transition-colors">
                        {halisaha.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Çalışma Saatleri</p>
                      <p className="text-gray-900">{halisaha.operatingHours || 'Her gün 09:00 - 23:00'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Olanaklar</h3>
                  <div className="flex flex-wrap gap-3">
                    {halisaha.amenities?.map((amenity, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800"
                      >
                        {amenity}
                      </span>
                    )) || (
                      <p className="text-gray-500">Olanak bilgisi bulunmamaktadır.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Galeri</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((image, index) => (
                  <div 
                    key={index}
                    className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {/* Open lightbox */}}
                  >
                    <img 
                      src={image} 
                      alt={`${halisaha.name} - ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Booking Section */}
          <motion.div 
            variants={fadeIn('left', 'tween', 0.2, 1)}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Rezervasyon Yap</h2>
                <p className="text-sm text-gray-500 mt-1">Tarih ve saat seçerek hemen rezervasyon yapın</p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Date Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarih Seçin
                  </label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      minDate={new Date()}
                      inline
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Field Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Saha Seçin
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {halisaha.fields?.map((fieldNumber) => (
                      <button
                        key={fieldNumber}
                        type="button"
                        onClick={() => handleFieldSelect(fieldNumber)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedField === fieldNumber
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Saha {fieldNumber}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                {selectedDate && selectedField && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Saat Seçin
                      </label>
                      {isLoadingSlots && (
                        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                      )}
                    </div>
                    
                    {availableTimeSlots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {availableTimeSlots.map((slot, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleTimeSlotSelect(slot)}
                            disabled={slot.booked}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              slot.booked
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                                : selectedTimeSlot === slot.time
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        Seçili tarih ve saha için müsait saat bulunamadı.
                      </div>
                    )}
                  </div>
                )}

                {/* Book Button */}
                <button
                  type="button"
                  onClick={handleBookClick}
                  disabled={!selectedDate || !selectedField || !selectedTimeSlot}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                    selectedDate && selectedField && selectedTimeSlot
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {isLoggedIn ? 'Rezervasyon Yap' : 'Giriş Yap & Rezervasyon Yap'}
                </button>

                {/* Success/Error Messages */}
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-green-50 text-green-800 text-sm rounded-lg flex items-start"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Rezervasyon Başarılı!</p>
                        <p>Rezervasyonunuz alındı. Onay için e-posta adresinizi kontrol edin.</p>
                      </div>
                      <button
                        onClick={() => setShowSuccess(false)}
                        className="ml-auto text-green-500 hover:text-green-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}

                  {showError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-red-50 text-red-800 text-sm rounded-lg flex items-start"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Hata Oluştu!</p>
                        <p>{error}</p>
                      </div>
                      <button
                        onClick={() => setShowError(false)}
                        className="ml-auto text-red-500 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Price Info */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fiyat Bilgisi</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">1 Saatlik Kiralama</span>
                  <span className="font-medium">{halisaha.pricePerHour || 200} ₺</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between font-medium">
                  <span>Toplam</span>
                  <span>{halisaha.pricePerHour || 200} ₺</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {halisaha.name}. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </motion.div>
  );
}

export default HaliSahaDetail;