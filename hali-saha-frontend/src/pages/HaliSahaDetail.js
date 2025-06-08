import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, Star, Calendar, ArrowLeft, Loader2, AlertCircle, CheckCircle, X, MessageSquare, UserCircle } from 'lucide-react'; // Added MessageSquare, UserCircle
import ReviewForm from '../Components/reviews/ReviewForm'; // Added ReviewForm import

// Import styles
import 'react-datepicker/dist/react-datepicker.css'; // DatePicker CSS'ini import et
import './HaliSahaDetail.css';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

function HaliSahaDetail() {
  // Helper function to check if a date is today
  const isToday = (someDate) => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
           someDate.getMonth() === today.getMonth() &&
           someDate.getFullYear() === today.getFullYear();
  };

  // Helper function to check if a time slot is in the past for today
  const isTimeSlotPast = (timeSlotString, date) => {
    if (!isToday(date)) {
      return false; // Not today, so not past in this context
    }
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const [slotHour, slotMinute] = timeSlotString.split(':').map(Number);

    if (slotHour < currentHour) {
      return true;
    }
    if (slotHour === currentHour && slotMinute <= currentMinute) {
      return true;
    }
    return false;
  };

  const { id } = useParams(); // URL'den halısaha ID'sini al
  const navigate = useNavigate(); // navigate hook'u için
  const location = useLocation(); // location hook'u için

  // State management
  const [halisaha, setHaliSaha] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedField, setSelectedField] = useState('1');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  // Mock images for the gallery
  const [galleryImages] = useState([
    'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1605&q=80',
    'https://images.unsplash.com/photo-1579952363872-0d7e3ecee5a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  ]);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('userToken');
      const userData = localStorage.getItem('user');
      setIsLoggedIn(!!(token && userData));
    };

    // Check auth on mount
    checkAuth();

    // Listen for storage events to sync auth state across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'userToken' || e.key === 'user' || e.key === null) {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleReviewSubmit = async ({ rating, comment }) => {
    if (!isLoggedIn) {
      setReviewError('Yorum yapmak için giriş yapmalısınız.');
      // navigate('/giris'); // Optionally redirect to login
      return;
    }
    setIsSubmittingReview(true);
    setReviewError(null);
    try {
      const token = localStorage.getItem('userToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/fields/${id}/reviews`,
        { rating, comment },
        config
      );
      // setShowSuccess(true); // Or a more specific review success message
      // setTimeout(() => setShowSuccess(false), 3000);
      alert(data.message || 'Değerlendirmeniz başarıyla eklendi!'); // Simple alert for now
      fetchHaliSahaDetails(); // Refresh data to show new review
    } catch (err) {
      const message = err.response?.data?.message || 'Değerlendirme gönderilirken bir hata oluştu.';
      setReviewError(message);
      // setShowError(true); // Or a more specific review error message
      // setTimeout(() => setShowError(false), 3000);
      console.error('Review submission error:', err.response?.data || err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

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

  const fetchHaliSahaDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/fields/${id}`);
      setHaliSaha(response.data);
      if (response.data && response.data.fields && response.data.fields.length > 0 && !selectedField) {
        setSelectedField(response.data.fields[0].toString());
      }
      setError(null); // Clear previous errors
    } catch (err) {
      setError('Halısaha detayları yüklenirken bir hata oluştu.');
      console.error('API Error fetching details:', err);
    } finally {
      setLoading(false);
    }
  }, [id, selectedField]);

  // Initial fetch of HaliSaha details
  useEffect(() => {
    fetchHaliSahaDetails();
  }, [fetchHaliSahaDetails]);

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

  const handleBookClick = async () => {
    if (!isLoggedIn) {
      // Save booking details to session storage for after login
      const bookingDetails = {
        halisahaId: id,
        date: selectedDate,
        field: selectedField,
        timeSlot: selectedTimeSlot,
        from: window.location.pathname
      };
      sessionStorage.setItem('pendingBooking', JSON.stringify(bookingDetails));
      
      // Redirect to login
      navigate('/giris', { 
        state: { 
          from: window.location.pathname,
          message: 'Rezervasyonunuzu tamamlamak için giriş yapın' 
        } 
      });
      return;
    }

    // Proceed with booking if user is logged in
    if (selectedDate && selectedField && selectedTimeSlot) {
      try {
        // Your existing booking logic here
        const response = await axios.post('http://localhost:5000/api/reservations', {
          halisahaId: id,
          fieldNumber: selectedField,
          date: selectedDate,
          timeSlot: selectedTimeSlot
        });
        
        // Show success message
        setShowSuccess(true);
        
        // Show booking details
        alert(`Rezervasyon bilgileri:\nTarih: ${selectedDate.toLocaleDateString()}\nSaha: ${selectedField}\nSaat: ${selectedTimeSlot}`);
        
        // Reset selections after booking
        setSelectedDate(null);
        setSelectedField(null);
        setSelectedTimeSlot(null);
        
        // Clear any pending booking
        sessionStorage.removeItem('pendingBooking');
        
      } catch (error) {
        console.error('Rezervasyon hatası:', error);
        setError(error.response?.data?.message || 'Rezervasyon yapılırken bir hata oluştu');
        setShowError(true);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
      >
        <motion.div 
          variants={fadeInUp}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-700">Halı saha bilgileri yükleniyor...</p>
        </motion.div>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
      >
        <motion.div 
          variants={fadeInUp}
          className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden p-6 text-center"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Bir Hata Oluştu</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Tekrar Dene
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  // Not found state
  if (!halisaha) {
    return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4"
      >
        <motion.div
          variants={fadeInUp}
          className="text-center"
        >
          <AlertCircle className="w-16 h-16 text-yellow-500 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Halı Saha Bulunamadı</h2>
          <p className="text-gray-600 mb-6">Aradığınız halı saha bulunamadı veya silinmiş olabilir.</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/sahalar')}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Halı Sahalara Dön
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50"
    >
      {/* Back Button */}
      <motion.button
        variants={fadeInUp}
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 flex items-center space-x-2 px-4 py-2 bg-sky-600 text-white rounded-full shadow-md hover:bg-white hover:text-sky-600 hover:border hover:border-sky-600 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Geri Dön</span>
      </motion.button>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-12"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-3xl font-bold text-gray-900"
          >
            {halisaha.name}
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-gray-600"
          >
            {halisaha.address}
          </motion.p>
        </motion.div>

        {/* Venue Header */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
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
                <span className="ml-2 text-sm text-white/90">({halisaha.numReviews || 0} Değerlendirme)</span>
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
            variants={itemVariants}
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
            variants={itemVariants}
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
                            disabled={slot.booked || (isToday(selectedDate) && isTimeSlotPast(slot.time, selectedDate))}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              (slot.booked || (isToday(selectedDate) && isTimeSlotPast(slot.time, selectedDate)))
                                ? `bg-gray-100 text-gray-400 cursor-not-allowed ${slot.booked ? 'line-through' : ''}`
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
                      ? isLoggedIn 
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {!selectedDate || !selectedField || !selectedTimeSlot 
                    ? 'Tarih, Saha ve Saat Seçin'
                    : isLoggedIn 
                      ? 'Rezervasyon Yap' 
                      : 'Giriş Yap & Rezervasyon Yap'}
                </button>

                {/* Success/Error Messages */}
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { 
                          opacity: 1, 
                          y: 0,
                          transition: { duration: 0.3 }
                        },
                        exit: { 
                          opacity: 0, 
                          y: -10,
                          transition: { duration: 0.2 }
                        }
                      }}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="p-3 bg-green-50 text-green-800 text-sm rounded-lg flex items-start"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Rezervasyon Başarılı!</p>
                        <p>Rezervasyonunuz alındı. Onay için e-posta adresinizi kontrol edin.</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowSuccess(false)}
                        className="ml-auto text-green-500 hover:text-green-700"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  )}

                  {showError && (
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { 
                          opacity: 1, 
                          y: 0,
                          transition: { duration: 0.3 }
                        },
                        exit: { 
                          opacity: 0, 
                          y: -10,
                          transition: { duration: 0.2 }
                        }
                      }}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="p-3 bg-red-50 text-red-800 text-sm rounded-lg flex items-start"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Hata Oluştu!</p>
                        <p>{error}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowError(false)}
                        className="ml-auto text-red-500 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Price Info */}
            <motion.div 
              variants={itemVariants}
              className="mt-6 bg-white rounded-2xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fiyat Bilgisi</h3>
              <motion.div 
                variants={containerVariants}
                className="space-y-3"
              >
                <motion.div variants={itemVariants} className="flex justify-between">
                  <span className="text-gray-600">1 Saatlik Kiralama</span>
                  <span className="font-medium">{halisaha.pricePerHour || 1380} ₺</span>
                </motion.div>
                <motion.div variants={itemVariants} className="border-t border-gray-200 my-2"></motion.div>
                <motion.div variants={itemVariants} className="flex justify-between font-medium">
                  <span>Toplam</span>
                  <span>{halisaha.pricePerHour || 1380} ₺</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer 
        variants={itemVariants}
        className="bg-white border-t border-gray-200 mt-12"
      >
        <motion.div 
          variants={itemVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {halisaha.name}. Tüm hakları saklıdır.
          </p>
        </motion.div>
      </motion.footer>

      {/* Reviews Section */}
      {halisaha && (
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible" 
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-900 mb-6">Değerlendirmeler ({halisaha.numReviews || 0})</motion.h2>
          
          {/* Review Form */}
          {isLoggedIn ? (
            <motion.div variants={fadeInUp} className="mb-8 p-6 bg-white rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Yorum Yapın</h3>
              <ReviewForm onSubmit={handleReviewSubmit} isLoading={isSubmittingReview} />
              {reviewError && <p className="text-sm text-red-600 mt-2">{reviewError}</p>}
            </motion.div>
          ) : (
            <motion.div variants={fadeInUp} className="mb-8 p-6 bg-gray-50 rounded-xl text-center">
              <p className="text-gray-700">Yorum yapmak için <button onClick={() => navigate('/giris', { state: { from: location.pathname, message: 'Yorum yapmak için giriş yapmanız gerekmektedir.' } })} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transform hover:scale-105">giriş yapmanız</button> gerekmektedir.</p>
            </motion.div>
          )}

          {/* Existing Reviews */}
          <motion.div variants={containerVariants} className="space-y-6">
            {halisaha.reviews && halisaha.reviews.length > 0 ? (
              halisaha.reviews.slice().reverse().map((review) => ( // .slice().reverse() to show newest first
                <motion.div 
                  key={review._id} 
                  variants={fadeInUp} 
                  className="bg-white p-5 rounded-lg shadow-md border border-gray-100"
                >
                  <div className="flex items-start mb-2">
                    <UserCircle className="w-10 h-10 text-gray-400 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">{review.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm pl-13">{review.comment}</p>
                </motion.div>
              ))
            ) : (
              <motion.p variants={fadeInUp} className="text-gray-600 text-center py-4">Henüz değerlendirme yapılmamış. İlk yorumu siz yapın!</motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default HaliSahaDetail;