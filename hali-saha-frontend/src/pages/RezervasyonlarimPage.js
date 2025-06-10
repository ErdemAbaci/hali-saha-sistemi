import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './RezervasyonlarimPage.css';

const RezervasyonlarimPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/giris');
      return;
    }
    fetchReservations();
  }, [user, navigate]);

  const fetchReservations = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get('/api/reservations/my-reservations', config);
      setReservations(data.reservations || []);
    } catch (error) {
      toast.error('Rezervasyonlar yüklenirken bir hata oluştu');
      console.error('Rezervasyon yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!token) {
      toast.error('Lütfen giriş yapın');
      return;
    }

    if (window.confirm('Bu rezervasyonu iptal etmek istediğinize emin misiniz?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        await axios.patch(
          `/api/reservations/${reservationId}/cancel`,
          {},
          config
        );

        toast.success('Rezervasyon iptal edildi');
        fetchReservations();
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Rezervasyon iptal edilirken bir hata oluştu';
        toast.error(errorMessage);
        console.error('İptal hatası:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="status-badge confirmed">
            <FaCheck /> Onaylandı
          </span>
        );
      case 'cancelled':
        return (
          <span className="status-badge cancelled">
            <FaTimes /> İptal Edildi
          </span>
        );
      case 'pending':
        return (
          <span className="status-badge pending">
            <FaExclamationTriangle /> Bekliyor
          </span>
        );
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-lg font-medium text-gray-700">Rezervasyonlar yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">Rezervasyonlarım</h1>
          <p className="text-lg text-gray-600">Tüm rezervasyonlarınızı buradan görüntüleyebilir ve yönetebilirsiniz</p>
        </div>
        
        {reservations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-100 mb-4">
              <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Henüz rezervasyonunuz yok</h3>
            <p className="text-gray-500 mb-6">Hemen bir saha rezervasyonu yaparak başlayın</p>
            <button
              onClick={() => navigate('/sahalar')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Saha Ara
            </button>
          </div>
        ) : (
          <div className="reservation-list">
            {reservations.map((reservation) => (
              <div key={reservation._id} className="reservation-card">
                <div className="reservation-header">
                  <h3 className="text-lg font-semibold text-gray-900">{reservation.field?.name || 'Saha Bilgisi Yok'}</h3>
                  {getStatusBadge(reservation.status)}
                </div>
                
                <div className="reservation-details">
                  <div className="detail-item">
                    <FaMapMarkerAlt className="detail-icon" />
                    <span className="text-gray-700">{reservation.field?.location || 'Konum bilgisi yok'}</span>
                  </div>
                  <div className="detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <span className="text-gray-700">{formatDate(reservation.date)}</span>
                  </div>
                  <div className="detail-item">
                    <FaClock className="detail-icon" />
                    <span className="text-gray-700">{reservation.hour}</span>
                  </div>
                  <div className="detail-item">
                    <span className="text-gray-700">Saha No: {reservation.fieldNumber}</span>
                  </div>
                </div>
                
                {reservation.status !== 'cancelled' && (
                  <div className="reservation-actions">
                    <button
                      onClick={() => handleCancelReservation(reservation._id)}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                      disabled={reservation.status === 'cancelled'}
                    >
                      İptal Et
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RezervasyonlarimPage;
