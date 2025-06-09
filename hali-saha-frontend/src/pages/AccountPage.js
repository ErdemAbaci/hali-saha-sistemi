import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountPage.css';
import axios from 'axios';

function AccountPage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        ...formData,
        name: userData.name || '',
        phone: userData.phone || ''
      });
    } else {
      navigate('/giris');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    try {
      // Update profile information
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        {
          name: formData.name,
          phone: formData.phone,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update local storage with new user data
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Show success message
      setMessage({ type: 'success', text: 'Profil bilgileriniz başarıyla güncellendi.' });
      
      // Reset form and exit edit mode
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Profil güncellenirken hata oluştu:', error);
      const errorMessage = error.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  if (!user) {
    return <div className="loading">Yükleniyor veya kullanıcı bilgisi bulunamadı...</div>;
  }

  return (
    <div className="account-page-container">
      <div className="profile-header">
        <h2>Profilim</h2>
      </div>
      
      {message.text && (
        <div className={`alert ${message.type}`}>
          {message.text}
        </div>
      )}

      {isEditing ? (
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ad Soyad</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>E-posta</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="disabled-input"
            />
            <small>E-posta adresiniz değiştirilemez.</small>
          </div>
          
          <div className="form-group">
            <label>Telefon</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Telefon numaranızı girin"
            />
          </div>
          
          <div className="password-section">
            <h3>Şifre Değiştir</h3>
            <div className="form-group">
              <label>Mevcut Şifre</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Mevcut şifrenizi girin"
              />
            </div>
            
            <div className="form-group">
              <label>Yeni Şifre</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Yeni şifrenizi girin"
              />
            </div>
            
            <div className="form-group">
              <label>Yeni Şifre Tekrar</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Yeni şifrenizi tekrar girin"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={() => {
              setIsEditing(false);
              setMessage({ type: '', text: '' });
            }}>
              İptal
            </button>
            <button type="submit" className="save-button">
              Kaydet
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-details">
          <div className="profile-info">
            <div className="info-row">
              <span className="label">Ad Soyad:</span>
              <span className="value">{user.name || 'Belirtilmemiş'}</span>
            </div>
            <div className="info-row">
              <span className="label">E-posta:</span>
              <span className="value">{user.email}</span>
            </div>
            <div className="info-row">
              <span className="label">Telefon:</span>
              <span className="value">{user.phone || 'Belirtilmemiş'}</span>
            </div>
          </div>
          {!isEditing && (
            <div className="edit-button-container">
              <button 
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Düzenle
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AccountPage;