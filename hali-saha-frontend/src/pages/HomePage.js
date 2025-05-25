// src/pages/HomePage.js

import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom'; // Artık HallsahaCard içinde kullanılacak
import axios from 'axios';
import HalisahaCards from '../Components/HaliSahaCards'; // HallsahaCard'ı import et
import './HomePage.css'; // Kendi CSS dosyasını import et

function HomePage() {
  const [hallsahalar, setHalisahalar] = useState([]);
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

  if (loading) {
    return <div className="home-page-container loading-message">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="home-page-container error-message">{error}</div>;
  }

  return (
    <div className="home-page-container">
      <h1>Halısahalar</h1>
      <div className="halisaha-list">
        {hallsahalar.map((halisaha) => (
          <HalisahaCards key={halisaha.id} halisaha={halisaha} /> // HallsahaCard komponentini kullan
        ))}
      </div>
    </div>
  );
}

export default HomePage;