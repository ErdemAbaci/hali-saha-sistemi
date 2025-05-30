import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Şifreler uyuşmuyor.');
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name: username,
        email,
        phone,
        password,
        confirmPassword
      });

      alert('Kayıt başarılı! Lütfen giriş yapın.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt olunurken bir hata oluştu.');
      console.error('Signup Error:', err.response || err);
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
            <h1 className="auth-title">Hesap Oluşturun</h1>
            <p className="auth-subtitle">Halısaha rezervasyonu yapmaya başlamak için hesap oluşturun</p>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon"></span>
                  <input
                    type="text"
                    placeholder="Adı-Soyadı"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
              </div>
              
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
                    type="text"
                    placeholder="Telefon Numarası"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
              
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon"></span>
                  <input
                    type="password"
                    placeholder="Şifreyi Doğrulayın"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}
              </button>
            </form>
            
            {/* Footer Link */}
            <div className="auth-footer">
              Zaten bir hesabınız var mı? <Link to="/login" className="auth-link">Giriş Yap</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;