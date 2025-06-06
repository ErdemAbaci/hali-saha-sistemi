import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // AuthContext'i import ediyoruz

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, token } = useAuth(); // AuthContext'ten kullanıcı ve token bilgilerini alıyoruz

  useEffect(() => {
    const fetchUsers = async () => {
      if (token) { // Token kontrolü
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const { data } = await axios.get('/api/users/admin/users', config);
          setUsers(data);
          setError('');
        } catch (err) {
          setError(err.response && err.response.data && err.response.data.message 
            ? err.response.data.message 
            : 'Kullanıcılar getirilirken bir hata oluştu.');
          console.error("Fetch Users Error:", err);
        }
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]); // token değiştiğinde useEffect'i tekrar çalıştır

  const handleRoleChange = async (userId, newRole) => {
    if (token) {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.put(`/api/users/admin/users/${userId}/role`, { role: newRole }, config);
        // Kullanıcı listesini güncelle
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        alert('Kullanıcı rolü başarıyla güncellendi!');
      } catch (err) {
        setError(err.response && err.response.data && err.response.data.message 
            ? err.response.data.message 
            : 'Rol güncellenirken bir hata oluştu.');
        console.error("Role Change Error:", err);
      }
    }
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Paneli - Kullanıcı Yönetimi</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
      {users.length === 0 && !loading && <p>Gösterilecek kullanıcı bulunamadı.</p>}
      {users.length > 0 && (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Ad Soyad</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Rol</th>
              <th className="py-3 px-4 text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.map((u) => (
              <tr key={u._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-4">{u.name}</td>
                <td className="py-3 px-4">{u.email}</td>
                <td className="py-3 px-4">{u.role}</td>
                <td className="py-3 px-4">
                  <select 
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="p-2 border rounded mr-2"
                  >
                    <option value="customer">Customer</option>
                    <option value="operator">Operator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;
