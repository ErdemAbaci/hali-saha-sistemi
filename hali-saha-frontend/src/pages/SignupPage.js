// src/pages/SignupPage.js
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom'; // useNavigate yerine useHistory
import axios from 'axios';

// SignupPage.css (veya App.css'e eklenebilir)
/*
Bu CSS LoginPage.css ile aynı olabilir, çünkü genellikle login/signup sayfaları benzer stile sahiptir.
Aynı stil dosyasını kullanmak istiyorsan, HomePage.css ve HallsahaDetail.css gibi ayrı bir LoginPage.css/SignupPage.css
oluşturup içini sadece auth-container ve auth-box gibi genel stillerle doldurabilirsin.
*/

function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const history = useHistory(); // useNavigate yerine useHistory hook'unu kullanıyoruz

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Şifreler uyuşmuyor.');
      return;
    }

    try {
      // Bu URL'i kendi backend API'nizin signup endpoint'ine göre değiştirin
      const response = await axios.post('http://localhost:3001/api/auth/signup', {
        username,
        email,
        password,
      });

      alert('Kayıt başarılı! Lütfen giriş yapın.');
      history.push('/login'); // Yönlendirme için history.push kullanıyoruz
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt olunurken bir hata oluştu.');
      console.error('Signup Error:', err.response || err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Kayıt Ol</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Kullanıcı Adı</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Şifreyi Onayla</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="auth-button">Kayıt Ol</button>
        </form>
        <div className="auth-link">
          Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;