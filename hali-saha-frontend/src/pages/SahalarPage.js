import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import HalisahaCards from '../Components/HaliSahaCards';
import './HomePage.css';

function SahalarPage() {
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

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Yükleniyor...</div>;
  }

  if (error) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Halısahalar</h1>
      <div className="halisaha-grid">
        {halisahalar.map((halisaha) => (
          <HalisahaCards key={halisaha._id} halisaha={halisaha} />
        ))}
      </div>
    </div>
  );
}

export default SahalarPage; 