import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import HalisahaCards from '../Components/HaliSahaCards';
import './HomePage.css';

function HomePage() {
  const [halisahalar, setHalisahalar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHalisahalar = async () => {
      try {
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
            <Link to="/login" className="btn-login">Giriş Yap</Link>
            <Link to="/signup" className="btn-signup">Kayıt Ol</Link>
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
            {halisahalar.slice(0, 6).map((halisaha) => (
              <HalisahaCards key={halisaha._id} halisaha={halisaha} />
            ))}
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