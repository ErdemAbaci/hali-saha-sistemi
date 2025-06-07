import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import HaliSahaCard from '../Components/HaliSahaCard'; // Düzeltildi: HalisahaCards -> HaliSahaCard
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
          <HaliSahaCard 
            key={halisaha._id} 
            id={halisaha._id} 
            name={halisaha.name} 
            location={halisaha.location} 
            rating={halisaha.rating} 
            reviewCount={halisaha.numReviews} // Modeldeki numReviews'ı reviewCount prop'una eşle
            price={halisaha.price} 
            image={halisaha.imageUrl || 'default-placeholder.jpg'} // imageUrl yoksa varsayılan bir resim göster
            // fields={halisaha.fields} // Bu prop HaliSahaCard'da tanımlı, gerekirse açılabilir
            // isAvailable={halisaha.isAvailable} // Bu prop HaliSahaCard'da tanımlı, backend'den geliyorsa açılabilir
            // bookingUrl={halisaha.bookingUrl} // Bu prop HaliSahaCard'da tanımlı, backend'den geliyorsa açılabilir
          />
        ))}
      </div>
    </div>
  );
}

export default SahalarPage; 