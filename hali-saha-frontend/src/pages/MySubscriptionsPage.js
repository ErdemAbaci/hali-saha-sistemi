import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MySubscriptionsPage = () => {
    const [activeSubscription, setActiveSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchActiveSubscription = async () => {
            if (!token) {
                navigate('/giris');
                return;
            }
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/subscriptions/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setActiveSubscription(response.data);
            } catch (err) {
                console.error('Aktif abonelik çekilirken hata oluştu:', err);
                setError(err.response?.data?.message || 'Abonelik bilgilerini getirirken bir hata oluştu.');
                setActiveSubscription(null);
            } finally {
                setLoading(false);
            }
        };

        fetchActiveSubscription();
    }, [token, navigate]);

    const handleCancelSubscription = async () => {
        if (!activeSubscription || !window.confirm('Aboneliğinizi iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
            return;
        }

        try {
            setLoading(true);
            await axios.delete(`http://localhost:5000/api/subscriptions/${activeSubscription._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setActiveSubscription(null); // Aboneliği sayfadan kaldır
            alert('Aboneliğiniz başarıyla iptal edildi.');
            setError(null);
        } catch (err) {
            console.error('Abonelik iptal edilirken hata oluştu:', err);
            setError(err.response?.data?.message || 'Aboneliği iptal ederken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Abonelik bilgileriniz yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
                    Aboneliklerim
                </h2>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                {!activeSubscription ? (
                    <div className="text-center py-10">
                        <p className="text-xl text-gray-600">Aktif bir aboneliğiniz bulunmamaktadır.</p>
                        <button
                            onClick={() => navigate('/abonelik')}
                            className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Hemen Bir Abonelik Satın Alın
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="mb-6 bg-blue-50 p-6 rounded-lg border border-blue-200">
                            <h3 className="text-2xl font-bold text-blue-800 mb-4">Aktif Aboneliğiniz</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                                <p><strong>Paket Adı:</strong> {activeSubscription.packageId.name}</p>
                                <p><strong>Fiyat:</strong> {activeSubscription.packageId.price.toLocaleString('tr-TR')} ₺</p>
                                <p><strong>Süre:</strong> {activeSubscription.packageId.duration} Ay</p>
                                <p><strong>Kalan Maç Hakkı:</strong> {activeSubscription.remainingMatches}</p>
                                <p><strong>Başlangıç Tarihi:</strong> {new Date(activeSubscription.startDate).toLocaleDateString('tr-TR')}</p>
                                <p><strong>Bitiş Tarihi:</strong> {new Date(activeSubscription.endDate).toLocaleDateString('tr-TR')}</p>
                            </div>
                        </div>

                        <div className="text-center mt-8">
                            <button
                                onClick={handleCancelSubscription}
                                disabled={loading}
                                className={`px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                                }`}
                            >
                                {loading ? 'İptal Ediliyor...' : 'Aboneliği İptal Et'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MySubscriptionsPage; 