import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Star, Calendar, ArrowRight, ChevronRight, Users, Shield, Zap } from 'lucide-react';

// Utils
import { fadeIn, staggerContainer, slideIn } from '../utils/animations';

// Components
import HaliSahaCard from '../Components/HaliSahaCard';

// Assets
const heroImage = 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80';
const feature1 = 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80';
const feature2 = 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80';
const feature3 = 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80';

const HomePage = () => {
  const navigate = useNavigate();
  const [halisahalar, setHalisahalar] = useState([
    {
      id: 1,
      name: 'Örnek Halı Saha 1',
      location: 'İstanbul, Kadıköy',
      rating: 4.5,
      reviewCount: 24,
      price: 200,
      image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
      fields: 3,
      isAvailable: true
    },
    {
      id: 2,
      name: 'Örnek Halı Saha 2',
      location: 'İstanbul, Beşiktaş',
      rating: 4.2,
      reviewCount: 18,
      price: 250,
      image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      fields: 2,
      isAvailable: true
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Test Kullanıcı');

  // Mock data for featured fields
  const featuredFields = [
    {
      id: 1,
      name: 'Elit Spor Kompleksi',
      location: 'Beşiktaş, İstanbul',
      price: 250,
      rating: 4.8,
      image: feature1,
      featured: true
    },
    {
      id: 2,
      name: 'Şampiyonlar Halı Saha',
      location: 'Kadıköy, İstanbul',
      price: 200,
      rating: 4.6,
      image: feature2,
      featured: true
    },
    {
      id: 3,
      name: 'Futbol Arena',
      location: 'Şişli, İstanbul',
      price: 300,
      rating: 4.9,
      image: feature3,
      featured: true
    },
    {
      id: 4,
      name: 'Arena Spor Merkezi',
      location: 'Üsküdar, İstanbul',
      price: 220,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe1954c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1593&q=80',
      featured: false
    },
  ];

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

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setHalisahalar(featuredFields);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Implement logout logic
    setIsLoggedIn(false);
    setUserName('');
  };

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
            key={saha.id}
            id={saha.id}
            name={saha.name}
            location={saha.location}
            rating={saha.rating}
            reviewCount={saha.reviewCount}
            price={saha.price}
            image={saha.image}
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
    <div className="homepage">
      {/* Header/Navbar */}
      <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <span className="brand-icon">⚽</span>
            <span className="brand-text">FormaGolü</span>
          </div>
          <nav className="navbar-nav">
            <Link to="/" className="nav-link">Ana Sayfa</Link>
            <Link to="/sahalar" className="nav-link">Sahalar</Link>
            <Link to="/nasil-calisir" className="nav-link">Nasıl Çalışır</Link>
          </nav>
          <div className="navbar-actions">
            {isLoggedIn ? (
              <>
                <Link to="/account" className="user-profile-link">
                  <span className="user-name">{userName}</span>
                  <div className="user-icon">👤</div>
                </Link>
                <button onClick={handleLogout} className="btn-signup">Çıkış Yap</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-login">Giriş Yap</Link>
                <Link to="/signup" className="btn-signup">Kayıt Ol</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Halısaha Kiralama Adresiniz<br />
            Saniyeler içinde
          </h1>
          <p className="hero-subtitle">
            Çevrendeki en iyi halısahaları bul ve istediğin zaman rezervasyon yap.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">Halısahaları Bul</button>
            <button className="btn-secondary">Nasıl Çalışır</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="football-ball"></div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">Nasıl Çalışır</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-icon search-icon">🔍</div>
              <h3>Halısaha Bul</h3>
              <p>Geniş halısaha yelpazemizi keşfet ve favori halısahanı seç.</p>
            </div>
            <div className="step">
              <div className="step-icon calendar-icon">📅</div>
              <h3>Tarih & Saat Seç</h3>
              <p>Size en uygun olan günü ve saati seçin.</p>
            </div>
            <div className="step">
              <div className="step-icon play-icon">⚽</div>
              <h3>Onayla ve maça başla!</h3>
              <p>Halısaha rezervasyonunu hızlı ve güvenli bir şekilde tamamla ve maça hazır ol.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Venues Section */}
      <section className="featured-venues">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Halısahalarımız</h2>
            <Link to="/sahalar" className="view-all-link">Bütün Mekanları Görüntüle</Link>
          </div>
          
          {loading && <div className="loading-message">Yükleniyor...</div>}
          {error && <div className="error-message">{error}</div>}
          
          <div className="venues-grid">
            {renderHalisahaCards()}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>İnternet üzerinden halısaha rezervasyonu deneyimine hazır mısın?</h2>
            <p>Futbol müsabakalarını platformumuz üzerinden yapan binlerce kullanıcıya katıl. Hızlı ve güvenli.</p>
            <button className="btn-cta">Get Started</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>FormaGolü</h4>
              <p>Bölgenizdeki en iyi sahalara hızlı ve güvenli şekilde rezervasyon yapın.</p>
            </div>
            <div className="footer-section">
              <h4>Sekmeler</h4>
              <ul>
                <li><Link to="/">Anasayfa</Link></li>
                <li><Link to="/sahalar">Halısahalar</Link></li>
                <li><Link to="/nasil-calisir">Nasıl Çalışır</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Destek</h4>
              <ul>
                <li><Link to="/contact">Bizimle İletişime Geç</Link></li>
                <li><Link to="/help">Yardım Merkezi</Link></li>
                <li><Link to="/terms">Politikilalar</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>İletişim Adresi</h4>
              <p>Ahmet Kabaklı KYK Erkek Öğrenci Yurdu<br />Elazığ, Türkiye<br />+90 555 123 4567</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 FormaGolü. Tüm Hakları Saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;