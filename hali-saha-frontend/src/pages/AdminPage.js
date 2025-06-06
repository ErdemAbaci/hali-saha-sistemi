import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import FieldForm from '../Components/operator/FieldForm'; // FieldForm import edildi
import { toast } from 'react-toastify'; // Bildirimler için

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, token } = useAuth();

  // Fields state
  const [fields, setFields] = useState([]);
  const [fieldsLoading, setFieldsLoading] = useState(true);
  const [fieldsError, setFieldsError] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditFieldModal, setShowEditFieldModal] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deletingFieldId, setDeletingFieldId] = useState(null); // Silme işlemi için loading state

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
  }, [token]);

  // Fetch Fields useEffect
  useEffect(() => {
    const fetchFields = async () => {
      if (token) {
        try {
          setFieldsLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          // Admin tüm sahaları bu endpoint'ten çekebilmeli (backend'de kontrol edilmeli)
          const { data } = await axios.get('/api/fields', config); 
          setFields(data);
          setFieldsError('');
        } catch (err) {
          setFieldsError(err.response?.data?.message || 'Sahalar getirilirken bir hata oluştu.');
          console.error("Fetch Fields Error:", err);
        }
        setFieldsLoading(false);
      }
    };

    fetchFields();
  }, [token]);

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

  // Modal Handlers
  const handleOpenDetailsModal = (field) => {
    setSelectedField(field);
    setShowDetailsModal(true);
  };

  const handleOpenEditModal = (field) => {
    setSelectedField(field);
    setShowEditFieldModal(true);
  };

  const handleCloseModals = () => {
    setShowDetailsModal(false);
    setShowEditFieldModal(false);
    setSelectedField(null);
  };

  const handleAdminDeleteField = async (fieldId) => {
    if (!window.confirm('Bu sahayı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }
    if (!token) {
      toast.error('Yetkilendirme tokenı bulunamadı.');
      return;
    }
    setDeletingFieldId(fieldId);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`/api/fields/${fieldId}`, config);
      setFields(prevFields => prevFields.filter(f => f._id !== fieldId));
      toast.success('Saha başarıyla silindi!');
    } catch (err) {
      const message = err.response?.data?.message || 'Saha silinirken bir hata oluştu.';
      toast.error(message);
      console.error("Admin Delete Field Error:", err.response?.data || err.message);
    }
    setDeletingFieldId(null);
  };

  const handleAdminUpdateFieldSubmit = async (formData) => {
    if (!selectedField || !selectedField._id) {
      toast.error('Düzenlenecek saha seçilemedi.');
      return;
    }
    if (!token) {
      toast.error('Yetkilendirme tokenı bulunamadı.');
      return;
    }
    setFormLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      const { data: updatedField } = await axios.put(`/api/fields/${selectedField._id}`, formData, config);
      setFields(prevFields => prevFields.map(f => f._id === selectedField._id ? updatedField : f));
      toast.success('Saha başarıyla güncellendi!');
      handleCloseModals();
    } catch (err) {
      const message = err.response?.data?.message || 'Saha güncellenirken bir hata oluştu.';
      toast.error(message);
      console.error("Admin Update Field Error:", err.response?.data || err.message);
    }
    setFormLoading(false);
  };

  if (loading || fieldsLoading) return <div className="flex justify-center items-center h-screen"><p className="text-xl">Yükleniyor...</p></div>;

  return (
    <div className="container mx-auto p-4 space-y-8">
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

      {/* Saha Yönetimi Bölümü */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Saha Yönetimi</h2>
        {fieldsError && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{fieldsError}</p>}
        {fields.length === 0 && !fieldsLoading && <p>Gösterilecek saha bulunamadı.</p>}
        {fields.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field) => (
              <div key={field._id} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">{field.name}</h3>
                <p className="text-gray-600 mb-1"><span className="font-medium">Konum:</span> {field.location}</p>
                <p className="text-gray-600 mb-1"><span className="font-medium">Fiyat:</span> {field.price} TL/saat</p>
                <p className="text-gray-600 mb-3"><span className="font-medium">İşletmeci:</span> {field.operator?.name || 'Belirtilmemiş'} ({field.operator?.email || 'N/A'})</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button onClick={() => handleOpenDetailsModal(field)} className="text-sm bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md">Detaylar</button>
                  <button onClick={() => handleOpenEditModal(field)} className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md">Düzenle</button>
                  <button 
                    onClick={() => handleAdminDeleteField(field._id)} 
                    className={`text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md ${deletingFieldId === field._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={deletingFieldId === field._id}
                  >
                    {deletingFieldId === field._id ? 'Siliniyor...' : 'Sil'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detaylar Modalı */}
      {showDetailsModal && selectedField && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">Saha Detayları: {selectedField.name}</h2>
            <div className="space-y-3">
              <p><span className="font-semibold">Saha ID:</span> {selectedField._id}</p>
              <p><span className="font-semibold">İşletmeci ID:</span> {selectedField.operator?._id || 'N/A'}</p>
              <p><span className="font-semibold">İşletmeci Adı:</span> {selectedField.operator?.name || 'N/A'}</p>
              <p><span className="font-semibold">İşletmeci Email:</span> {selectedField.operator?.email || 'N/A'}</p>
              <p><span className="font-semibold">Konum:</span> {selectedField.location}</p>
              <p><span className="font-semibold">Adres:</span> {selectedField.address}</p>
              <p><span className="font-semibold">Fiyat:</span> {selectedField.price} TL/saat</p>
              <p><span className="font-semibold">Telefon:</span> {selectedField.phone || '-'}</p>
              <p><span className="font-semibold">E-posta (Saha):</span> {selectedField.email || '-'}</p>
              <p><span className="font-semibold">Çalışma Saatleri:</span> {selectedField.operatingHours || '-'}</p>
              <p><span className="font-semibold">Tesisteki Alt Saha Sayısı:</span> {selectedField.fieldCount || '-'}</p>
              <p><span className="font-semibold">Alt Saha Numaraları:</span> {selectedField.fields?.join(', ') || '-'}</p>
              {selectedField.imageUrl && <img src={selectedField.imageUrl} alt={selectedField.name} className="mt-4 rounded-md max-h-60 object-contain" />}
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={handleCloseModals} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg">
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Düzenleme Modalı (FieldForm ile) */}
      {showEditFieldModal && selectedField && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Sahayı Düzenle: {selectedField.name}</h2>
            <FieldForm 
              onSubmit={handleAdminUpdateFieldSubmit} 
              initialData={selectedField} 
              onCancel={handleCloseModals} 
              isLoading={formLoading} 
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPage;
