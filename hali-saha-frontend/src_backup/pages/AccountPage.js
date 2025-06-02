import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountPage.css'; // Yeni CSS dosyası oluşturacağız

function AccountPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Kullanıcı bilgisi yoksa giriş sayfasına yönlendir
      navigate('/login');
    }
  }, [navigate]);

  if (!user) {
    return <div>Yükleniyor veya kullanıcı bilgisi bulunamadı...</div>; // Yönlendirme olana kadar geçici mesaj
  }

  return (
    <div className="account-page-container">
      <h2>Hesap Bilgilerim</h2>
      <div className="account-details">
        <p><strong>Adı Soyadı:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {user.phone && <p><strong>Telefon:</strong> {user.phone}</p>}
        {/* Diğer kullanıcı bilgileri eklenebilir */}
      </div>
      {/* Kullanıcının rezervasyonlarını listeleme gibi özellikler buraya eklenebilir */}
    </div>
  );
}

export default AccountPage; 