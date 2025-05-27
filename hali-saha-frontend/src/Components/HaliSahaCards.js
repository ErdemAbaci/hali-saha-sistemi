// src/components/HallsahaCard.js
import React from 'react';
import { Link } from 'react-router-dom';

// Bu CSS, src/pages/HomePage.css içinde zaten tanımlı.
// Eğer HallsahaCard'ın kendi özel CSS'i olsun istersen,
// src/components/HallsahaCard.css oluşturup buraya import edebilirsin.
// import './HallsahaCard.css';

function HalisahaCards({ halisaha: halisaha }) {
  return (
    <Link to={`/halisaha/${halisaha.id}`} className="halisaha-card">
      <img
        src={halisaha.imageUrl || 'https://via.placeholder.com/300x180?text=Halısaha'}
        alt={halisaha.name}
        className="halisaha-card-image"
      />
      <div className="halisaha-card-content">
        <h3>{halisaha.name}</h3>
        <p>Adres: {halisaha.address}</p>
        <p>Çalışma Saatleri: {halisaha.openingHours}</p>
        <p>Saha Sayısı: {halisaha.fieldCount}</p>
        {halisaha.pricePerHour && <p className="price">{halisaha.pricePerHour} TL/saat</p>}
      </div>
    </Link>
  );
}

export default HalisahaCards;