import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('userToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      alert('Giriş başarılı!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş yapılırken bir hata oluştu.');
      console.error('Login Error:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Header */}
      <header className="auth-header">
        <div className="auth-header-container">
          <Link to="/" className="auth-brand">
            <span className="brand-icon">⚽</span>
            <span className="brand-text">FormaGolü</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="auth-main">
        <div className="auth-container">
          <div className="auth-card">
            {/* Icon */}
            <div className="auth-icon">
              <div className="shield-icon">🛡️</div>
            </div>
            
            {/* Title */}
            <h1 className="auth-title">Hoşgeldiniz!</h1>
            <p className="auth-subtitle">Devam etmek için giriş yapın</p>
            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon"></span>
                  <input
                    type="email"
                    placeholder="Email Adresi"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon"></span>
                  <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>
            
            {/* Footer Link */}
            <div className="auth-footer">
              Hesabınız Yok mu? <Link to="/signup" className="auth-link">Kayıt Ol</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;