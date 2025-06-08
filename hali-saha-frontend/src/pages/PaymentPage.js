import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import "./PaymentPage.css";

// Stripe public key'i buraya gelecek
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51O...'); // Test key'inizi buraya yazın

const PaymentForm = ({ amount, onSuccess, reservationDetails }) => {
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
        amount: amount
      });

      // Backend'e ödeme bilgilerini gönder
      const response = await axios.post('http://localhost:5000/api/payments/create', {
        paymentMethodId: paymentMethod.id,
        amount: amount,
        fieldId: reservationDetails.fieldId,
        fieldNumber: reservationDetails.fieldNumber,
        date: reservationDetails.date,
        hour: reservationDetails.hour
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

        console.log('Ödeme başarılı, rezervasyon kaydediliyor...');
        await handlePaymentSuccess(response.data);
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

  const handlePaymentSuccess = async (paymentData) => {
    try {
      if (!token) {
        setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        navigate('/giris');
        return;
      }

      // Başarılı ödeme sonrası yönlendirme
      navigate('/hesabim', {
        state: { 
          message: 'Rezervasyonunuz ve ödemeniz başarıyla tamamlandı!',
          success: true
        }
      });
    } catch (error) {
      console.error('Yönlendirme hatası:', error);
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ödeme Bilgileri</h2>
        <p className="text-gray-600">Toplam Tutar: {amount} TL</p>
      </div>

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
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing || !cardComplete}
        className={`w-full mt-6 py-3 px-4 rounded-lg font-medium text-white transition-colors ${
          !stripe || processing || !cardComplete
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {processing ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const [amount, setAmount] = useState(0);
  const [reservationDetails, setReservationDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const details = location.state?.reservationDetails;
    if (!details) {
      navigate('/');
      return;
    }
    setReservationDetails(details);
    setAmount(details.amount);
  }, [location, navigate]);

  if (!reservationDetails) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="payment-container">
      <h1 className="payment-title">Ödeme</h1>
      <Elements stripe={stripePromise}>
        <PaymentForm 
          amount={amount} 
          reservationDetails={reservationDetails}
        />
      </Elements>
    </div>
  );
};

export default PaymentPage; 