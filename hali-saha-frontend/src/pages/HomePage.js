import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Star, ArrowRight, ChevronRight, Shield, Zap, Calendar, Users, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import axios from 'axios';

// Components
import HaliSahaCard from '../Components/HaliSahaCard';

// Assets
const heroImage = 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80';

const HomePage = () => {
  const navigate = useNavigate();
  const [halisahalar, setHalisahalar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchHalisahalar = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/fields');
        setHalisahalar(response.data);
      } catch (err) {
        setError('Halısahalar yüklenirken bir hata oluştu.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHalisahalar();
  }, []);

  // Features data
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: 'Güvenli Ödeme',
      description: '%100 güvenli ödeme sistemi ile güvenli alışveriş yapın.'
    },
    {
      icon: <Zap className="w-8 h-8 text-primary-600" />,
      title: 'Hızlı Rezervasyon',
      description: 'Birkaç tıklama ile hızlı ve kolay rezervasyon yapın.'
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: 'Geniş Seçenekler',
      description: 'Yüzlerce halı saha arasından size uygun olanı bulun.'
    },
  ];

  // Handle logout
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
  };

  // Check if user is logged in on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setIsLoggedIn(true);
      setUserName(user.name || 'Kullanıcı');
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to search results with query params
    navigate(`/sahalar?q=${searchQuery}&location=${location}&date=${date}&time=${time}`);
  };

  // Render halisaha cards
  const renderHalisahaCards = () => {
    return halisahalar.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {halisahalar.map((saha) => (
          <HaliSahaCard
            key={saha._id}
            id={saha._id}
            name={saha.name}
            location={saha.location}
            rating={saha.rating}
            reviewCount={saha.numReviews}
            price={saha.price}
            image={saha.imageUrl || 'https://via.placeholder.com/400x300?text=Halı+Saha'}
            fields={saha.fields}
            isAvailable={saha.isAvailable}
          />
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <p className="text-gray-500">Gösterilecek halı saha bulunamadı.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Halı Saha Kiralama Adresiniz
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10">
              Çevrenizdeki en iyi halı sahaları keşfedin ve kolayca rezervasyon yapın.
            </p>
            <div className="mt-12 text-center">
              <p className="text-2xl md:text-3xl text-white font-semibold max-w-3xl mx-auto mb-6">
                Halısaha ekibin hazırsa kadronu oluştur!
              </p>
              <Link to="/lineup-builder" className="inline-block">
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75">
                  Kadro Kur
                </button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Neden Bizi Tercih Etmelisiniz?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Halı saha rezervasyonunuzu kolayca yapmanız için tüm ihtiyaçlarınızı düşündük.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Fields Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Popüler Halı Sahalar</h2>
              <p className="mt-2 text-lg text-gray-600">En çok tercih edilen halı sahalar</p>
            </div>
            <Link 
              to="/sahalar" 
              className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium"
            >
              Tümünü Gör <ChevronRightIcon className="ml-1 h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && <p>Popüler sahalar yükleniyor...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && halisahalar.slice(0, 3).map((saha) => (
              <HaliSahaCard
                key={saha._id}
                id={saha._id}
                name={saha.name}
                location={saha.location}
                rating={saha.rating}
                reviewCount={saha.numReviews}
                price={saha.price}
                image={saha.imageUrl || 'https://via.placeholder.com/400x300?text=Halı+Saha'}
                isAvailable={true}
                // bookingUrl={`/halisaha/${saha._id}`}
              />
            ))}
            {!loading && !error && halisahalar.length === 0 && (
              <p>Gösterilecek popüler saha bulunamadı.</p>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Nasıl Çalışır?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Sadece 3 adımda halı saha rezervasyonunuzu yapın.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-6 mx-auto text-2xl">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">
                Halı Saha Bul
              </h3>
              <p className="text-gray-600 text-center">
                Konumunuza en yakın veya istediğiniz özelliklerdeki halı sahaları bulun.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-6 mx-auto text-2xl">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">
                Tarih & Saat Seçin
              </h3>
              <p className="text-gray-600 text-center">
                Size uygun gün ve saati seçerek rezervasyon yapın.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-6 mx-auto text-2xl">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">
                Onaylayın ve Oynayın
              </h3>
              <p className="text-gray-600 text-center">
                Rezervasyonunuzu tamamlayın ve maçınızı yapmaya başlayın!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold mb-6">
            İnternet üzerinden halı saha rezervasyonu deneyimine hazır mısın?
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Futbol müsabakalarını platformumuz üzerinden yapan binlerce kullanıcıya katıl. Hızlı ve güvenli.
          </p>
          <Link 
            to="/sahalar" 
            className="inline-block bg-white text-primary-600 font-medium px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Hemen Başla
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;