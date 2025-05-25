// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom'; // navigate yerine useHistory
import axios from 'axios';

// LoginPage.css (veya App.css'e eklenebilir)
/*
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 40px);
    padding: 20px;
    background-color: #f0f2f5;
}

.auth-box {
    background-color: #fff;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
}

.auth-box h2 {
    margin-bottom: 25px;
    color: #333;
}

.form-group {
    margin-bottom: 20px;
    text-align: left;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #555;
}

.form-group input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1em;
}

.auth-button {
    width: 100%;
    padding: 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1em;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
}

.auth-button:hover {
    background-color: #0056b3;
}

.auth-link {
    margin-top: 20px;
    font-size: 0.95em;
    color: #666;
}

.auth-link a {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
}

.auth-link a:hover {
    text-decoration: underline;
}

.error-message {
    color: #dc3545;
    margin-top: 10px;
    font-size: 0.9em;
}
*/

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const history = useHistory(); // useNavigate yerine useHistory hook'unu kullanıyoruz

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Bu URL'i kendi backend API'nizin login endpoint'ine göre değiştirin
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('userToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      alert('Giriş başarılı!');
      history.push('/'); // Yönlendirme için history.push kullanıyoruz
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş yapılırken bir hata oluştu.');
      console.error('Login Error:', err.response || err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Giriş Yap</h2>
        <form onSubmit={handleSubmit}>
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
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="auth-button">Giriş Yap</button>
        </form>
        <div className="auth-link">
          Hesabın yok mu? <Link to="/signup">Kayıt Ol</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;