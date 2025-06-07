import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import FieldForm from '../Components/operator/FieldForm'; // FieldForm import edildi, path düzeltildi MEMORY[e7108e4d-c67d-403e-b454-c4e66eec6b5c]
import { toast } from 'react-toastify'; // Bildirimler için

const OperatorPage = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth(); // AuthContext'ten token bilgisini alıyoruz
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [showEditFieldModal, setShowEditFieldModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchFields = async () => {
      if (token) {
        setLoading(true);
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const { data } = await axios.get('/api/fields/operator/fields', config);
          setFields(data);
          setError('');
        } catch (err) {
          setError(
            err.response && err.response.data && err.response.data.message
              ? err.response.data.message
              : 'Sahalar getirilirken bir hata oluştu.'
          );
          console.error("Fetch Fields Error:", err);
        }
        setLoading(false);
      }
    };

    fetchFields();
  }, [token]);

  const handleOpenAddFieldModal = () => {
    setSelectedField(null); // Yeni ekleme için seçili alanı temizle
    setShowAddFieldModal(true);
  };

  const handleOpenEditModal = (fieldToEdit) => {
    setSelectedField(fieldToEdit);
    setShowEditFieldModal(true);
  };

  const handleOpenDetailsModal = (fieldDetails) => {
    setSelectedField(fieldDetails);
    setShowDetailsModal(true);
  };

  const handleDeleteField = async (fieldId) => {
    if (window.confirm('Bu sahayı silmek istediğinizden emin misiniz?')) {
      try {
        // TODO: API çağrısını ekle: await axios.delete(`/api/fields/${fieldId}`, { headers: { Authorization: `Bearer ${token}` } });
        // setFields(fields.filter(f => f._id !== fieldId));
        // API call for delete will be added later
        toast.info('Saha silme işlemi (API BAĞLANTISI BEKLİYOR) - ID: ' + fieldId);
      } catch (err) {
        console.error("Delete Field Error:", err);
        setError(err.response?.data?.message || 'Saha silinirken bir hata oluştu.');
      }
    }
  };


  const handleAddFieldSubmit = async (formData) => {
    if (!token) {
      toast.error('Yetkilendirme tokenı bulunamadı.');
      return;
    }
    setFormLoading(true);
    setError('');
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post('/api/fields', formData, config);
      setFields(prevFields => [data, ...prevFields]); // Yeni sahayı listenin başına ekle
      setShowAddFieldModal(false);
      toast.success('Yeni saha başarıyla eklendi!');
    } catch (err) {
      const message = err.response?.data?.message || 'Saha eklenirken bir hata oluştu.';
      setError(message);
      toast.error(message);
      console.error("Add Field Error:", err.response?.data || err.message);
    }
    setFormLoading(false);
  };

  const handleEditFieldSubmit = async (formData) => {
    if (!token || !selectedField?._id) {
      toast.error('Gerekli bilgiler eksik (token veya saha ID).');
      setFormLoading(false); // Ensure loading is stopped
      return;
    }
    setFormLoading(true);
    setError('');
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.put(`/api/fields/${selectedField._id}`, formData, config);
      setFields(prevFields => prevFields.map(f => f._id === selectedField._id ? data : f));
      setShowEditFieldModal(false);
      setSelectedField(null); // Clear selected field after successful edit
      toast.success('Saha başarıyla güncellendi!');
    } catch (err) {
      const message = err.response?.data?.message || 'Saha güncellenirken bir hata oluştu.';
      setError(message);
      toast.error(message);
      console.error("Edit Field Error:", err.response?.data || err.message);
    }
    setFormLoading(false);
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><p className="text-xl">Yükleniyor...</p></div>;

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-700">Halı Saha Yönetimi</h1>
        <button 
          onClick={() => setShowAddFieldModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          Yeni Saha Ekle
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow" role="alert">
          <p className="font-bold">Hata</p>
          <p>{error}</p>
        </div>
      )}

      {fields.length === 0 && !loading && (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">Henüz eklenmiş bir sahanız bulunmamaktadır.</p>
          <p className="text-gray-400 mt-2">Yukarıdaki 'Yeni Saha Ekle' butonu ile ilk sahanızı oluşturabilirsiniz.</p>
        </div>
      )}

      {/* Saha listesi buraya gelecek */}
      {fields.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((field) => (
            <div key={field._id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{field.name}</h2>
              <p className="text-gray-600 mb-1"><span className="font-medium">Konum:</span> {field.location}</p>
              <p className="text-gray-600 mb-1"><span className="font-medium">Adres:</span> {field.address}</p>
              <p className="text-gray-600 mb-3"><span className="font-medium">Fiyat:</span> {field.price} TL/saat</p>
              {/* Daha fazla detay ve işlem butonları eklenecek */}
                
              <div className="mt-4 flex justify-end space-x-2">
                <button onClick={() => handleOpenDetailsModal(field)} className="text-sm bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md">Detaylar</button>
                <button onClick={() => handleOpenEditModal(field)} className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md">Düzenle</button>
                <button onClick={() => handleDeleteField(field._id)} className="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md">Sil</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Yeni Saha Ekleme Modalı */}
      {showAddFieldModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Yeni Saha Ekle</h2>
            <FieldForm 
              onSubmit={handleAddFieldSubmit} 
              onCancel={() => setShowAddFieldModal(false)} 
              isLoading={formLoading} 
            />
          </div>
        </div>
      )}

      {/* Saha Düzenleme Modalı */}
      {showEditFieldModal && selectedField && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Sahayı Düzenle: {selectedField.name}</h2>
            <FieldForm
              onSubmit={handleEditFieldSubmit}
              onCancel={() => {
                setShowEditFieldModal(false);
                setSelectedField(null); // Clear selected field on cancel
              }}
              initialData={selectedField} // Pass current field data to prefill
              isLoading={formLoading}
              isEditMode={true} // Optional: FieldForm might use this to change button text or behavior
            />
          </div>
        </div>
      )}

      {/* Saha Detayları Modalı */}
      {showDetailsModal && selectedField && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Saha Detayları: {selectedField.name}</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">Konum:</span> {selectedField.location}</p>
              <p><span className="font-semibold">Adres:</span> {selectedField.address}</p>
              <p><span className="font-semibold">Fiyat:</span> {selectedField.price} TL/saat</p>
              <p><span className="font-semibold">Telefon:</span> {selectedField.phone || '-'}</p>
              <p><span className="font-semibold">E-posta:</span> {selectedField.email || '-'}</p>
              <p><span className="font-semibold">Çalışma Saatleri:</span> {selectedField.operatingHours || '-'}</p>
              <p><span className="font-semibold">Alt Saha Sayısı:</span> {selectedField.fieldCount || '-'}</p>
              <p><span className="font-semibold">Alt Saha Numaraları:</span> {selectedField.fields?.join(', ') || '-'}</p>
              {/* Müsaitlik durumu buraya eklenebilir */}
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setShowDetailsModal(false)} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg">
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorPage;
