import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Stripe public key'i buraya gelecek
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51O...'); // Test key'inizi buraya yazın

const SubPaymentForm = ({ amount, packageDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Ödeme sistemi başlatılamadı. Lütfen sayfayı yenileyin.');
      setProcessing(false);
      return;
    }

    try {
      console.log('Kart bilgileri alınıyor...');
      const { error: cardError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (cardError) {
        console.error('Kart hatası:', cardError);
        setError(cardError.message);
        setProcessing(false);
        return;
      }

      if (!token) {
        setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        navigate('/giris');
        return;
      }

      console.log('Ödeme isteği gönderiliyor...', {
        paymentMethodId: paymentMethod.id,
        amount: amount,
        packageId: packageDetails._id
      });

      // Backend'e ödeme bilgilerini gönder
      const response = await axios.post('http://localhost:5000/api/payments/create-subscription', {
        paymentMethodId: paymentMethod.id,
        amount: amount,
        type: 'subscription',
        packageId: packageDetails._id
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Backend yanıtı:', response.data);

      if (response.data.success) {
        if (response.data.requiresAction) {
          console.log('3D Secure doğrulaması gerekiyor...');
          // 3D Secure doğrulaması gerekiyorsa
          const { error: confirmError } = await stripe.confirmCardPayment(
            response.data.paymentIntentClientSecret
          );

          if (confirmError) {
            console.error('3D Secure hatası:', confirmError);
            setError(confirmError.message);
            setProcessing(false);
            return;
          }
        }

        console.log('Ödeme başarılı, abonelik aktifleştiriliyor...');
        navigate('/aboneliklerim', {
          state: { 
            message: 'Aboneliğiniz başarıyla aktifleştirildi!',
            success: true
          }
        });
      } else {
        console.error('Ödeme başarısız:', response.data);
        setError(response.data.message || 'Ödeme işlemi başarısız oldu.');
      }
    } catch (err) {
      console.error('Ödeme hatası:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });

      if (err.response?.status === 401) {
        setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        navigate('/giris');
      } else {
        setError(err.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }

    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Abonelik Ödemesi</h2>
              <p className="mt-2 text-gray-600">Seçilen Paket: {packageDetails.name}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Paket Süresi:</span>
                <span className="font-medium">{packageDetails.duration} Ay</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Maç Hakkı:</span>
                <span className="font-medium">{packageDetails.matchCount} Maç</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-lg font-medium text-gray-900">Toplam Tutar:</span>
                <span className="text-2xl font-bold text-primary-600">{amount.toLocaleString('tr-TR')} ₺</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kart Bilgileri
                </label>
                <div className="p-3 border border-gray-300 rounded-md">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                        invalid: {
                          color: '#9e2146',
                        },
                      },
                      hidePostalCode: true,
                    }}
                    onChange={(e) => {
                      setCardComplete(e.complete);
                      if (e.error) {
                        setError(e.error.message);
                      } else {
                        setError(null);
                      }
                    }}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Test kartı: 4242 4242 4242 4242
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!stripe || processing || !cardComplete}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                  !stripe || processing || !cardComplete
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {processing ? 'İşleniyor...' : 'Aboneliği Satın Al'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubPaymentPage = () => {
  const [amount, setAmount] = useState(0);
  const [packageDetails, setPackageDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const details = location.state;
    if (!details) {
      navigate('/abonelik');
      return;
    }
    setPackageDetails(details);
    setAmount(details.amount);
  }, [location, navigate]);

  if (!packageDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <SubPaymentForm 
        amount={amount} 
        packageDetails={packageDetails}
      />
    </Elements>
  );
};

export default SubPaymentPage; 