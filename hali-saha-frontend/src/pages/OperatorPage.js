import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // AuthContext'i import ediyoruz

const OperatorPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, token } = useAuth(); // AuthContext'ten kullanıcı ve token bilgilerini alıyoruz

  useEffect(() => {
    const fetchCustomers = async () => {
      if (token) { // Token var mı diye kontrol et
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          // Admin veya operatör bu endpoint'e erişebilir, backend bunu yönetiyor.
          const { data } = await axios.get('/api/users/operator/users', config);
          setCustomers(data);
          setError('');
        } catch (err) {
          setError(err.response && err.response.data && err.response.data.message 
            ? err.response.data.message 
            : 'Müşteriler getirilirken bir hata oluştu.');
          console.error("Fetch Customers Error:", err);
        }
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [token]); // token değiştiğinde useEffect'i tekrar çalıştır

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Operatör Paneli - Müşteri Listesi</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
      {customers.length === 0 && !loading && <p>Gösterilecek müşteri bulunamadı.</p>}
      {customers.length > 0 && (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Ad Soyad</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Rol</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {customers.map((customer) => (
              <tr key={customer._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-4">{customer.name}</td>
                <td className="py-3 px-4">{customer.email}</td>
                <td className="py-3 px-4">{customer.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OperatorPage;
