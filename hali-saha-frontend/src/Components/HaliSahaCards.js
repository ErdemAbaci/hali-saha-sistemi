// src/components/HallsahaCard.js
import React from 'react';
import { Link } from 'react-router-dom';

function HalisahaCards({ halisaha }) {
  return (
    <Link to={`/halisaha/${halisaha._id}`} className="halisaha-card">
      <img
        src={halisaha.imageUrl || 'https://via.placeholder.com/300x180?text=Halısaha'}
        alt={halisaha.name}
        className="halisaha-card-image"
      />
      <div className="halisaha-card-content">
        <h3>{halisaha.name}</h3>
        <p>Adres: {halisaha.address}</p>
        <p>Çalışma Saatleri: {halisaha.operatingHours}</p>
        <p>Saha Sayısı: {halisaha.fieldCount}</p>
        {halisaha.price && <p className="price">{halisaha.price} TL/saat</p>}
      </div>
    </Link>
  );
}

export default HalisahaCards;