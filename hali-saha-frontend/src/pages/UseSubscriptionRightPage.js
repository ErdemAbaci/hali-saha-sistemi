import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

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

function UseSubscriptionRightPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [reservationDetails, setReservationDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    console.log('UseSubscriptionRightPage: location state is:', location.state);
    if (location.state && location.state.reservationDetails) {
      setReservationDetails(location.state.reservationDetails);
      console.log('UseSubscriptionRightPage: Reservation Details received:', location.state.reservationDetails);
    } else {
      console.log('UseSubscriptionRightPage: No reservation details in location state, navigating to /sahalar.');
      // Eğer rezervasyon detayları yoksa ana sayfaya veya halı saha seçme sayfasına yönlendir
      navigate('/sahalar', { replace: true });
    }
  }, [location.state, navigate]);

  const handleConfirmUseSubscription = async () => {
    if (!reservationDetails) {
      setError('Rezervasyon detayları eksik.');
      console.error('handleConfirmUseSubscription: Reservation details are null.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('Kullanıcı oturumu bulunamadı. Lütfen giriş yapın.');
        setLoading(false);
        navigate('/giris');
        return;
      }
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const dataToSend = {
        fieldId: reservationDetails.fieldId,
        fieldNumber: reservationDetails.fieldNumber,
        date: reservationDetails.date,
        hour: reservationDetails.hour,
        halisahaId: reservationDetails.halisahaId,
      };

      console.log('UseSubscriptionRightPage: Data being sent to backend:', dataToSend);
      console.log('UseSubscriptionRightPage: Token:', token);

      const response = await axios.post(
        'http://localhost:5000/api/subscriptions/use-subscription-right',
        dataToSend,
        config
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/rezervasyonlarim'); // Başarılı olursa rezervasyonlarım sayfasına yönlendir
        }, 2000);
      } else {
        setError(response.data.message || 'Abonelik hakkı kullanılırken bir hata oluştu.');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Abonelik hakkı kullanılırken bir hata oluştu.';
      setError(message);
      console.error('Abonelik hakkı kullanım hatası:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!reservationDetails) {
    return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
      >
        <motion.div 
          variants={itemVariants}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-700">Rezervasyon detayları yükleniyor...</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
    >
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center"
      >
        {success ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">İşlem Başarılı!</h2>
            <p className="text-gray-600 mb-6">Abonelik hakkınız başarıyla kullanıldı ve rezervasyonunuz kaydedildi.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/rezervasyonlarim')}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors"
            >
              Rezervasyonlarıma Git
            </motion.button>
          </motion.div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Abonelik Hakkını Kullan</h2>
            <p className="text-lg text-gray-700 mb-4">Aşağıdaki rezervasyonu abonelik hakkınızla onaylamak üzeresiniz:</p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
              <p className="text-gray-800"><span className="font-semibold">Halı Saha:</span> {reservationDetails?.fieldName}</p>
              <p className="text-gray-800"><span className="font-semibold">Saha Numarası:</span> {reservationDetails?.fieldNumber}</p>
              <p className="text-gray-800"><span className="font-semibold">Tarih:</span> {new Date(reservationDetails?.date).toLocaleDateString('tr-TR')}</p>
              <p className="text-gray-800"><span className="font-semibold">Saat:</span> {reservationDetails?.hour}</p>
            </div>
            <p className="text-red-600 text-base mb-6 font-semibold">Bu işlem, abonelik hakkınızdan bir maç düşürecektir. Onaylıyor musunuz?</p>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex items-center justify-center p-3 mb-4 bg-red-100 text-red-700 rounded-lg"
              >
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition-colors"
              >
                Geri Dön
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirmUseSubscription}
                disabled={loading}
                className={`flex-1 px-6 py-3 font-semibold rounded-lg shadow-md transition-colors ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Onayla ve Abonelik Hakkını Kullan'
                )}
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default UseSubscriptionRightPage; 