import React, { useState, useEffect } from 'react';

const FieldForm = ({ onSubmit, initialData = null, onCancel, isLoading, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    price: '',
    phone: '',
    email: '',
    imageUrl: '',
    operatingHours: '',
    fieldCount: '',
    fields: '', // Virgülle ayrılmış sayılar, örn: "1,2,3"
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        location: initialData.location || '',
        address: initialData.address || '',
        price: initialData.price || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        imageUrl: initialData.imageUrl || '',
        operatingHours: initialData.operatingHours || '',
        fieldCount: initialData.fieldCount || '',
        fields: Array.isArray(initialData.fields) ? initialData.fields.join(', ') : '',
      });
    } else {
      // Yeni form için state'i sıfırla
      setFormData({
        name: '',
        location: '',
        address: '',
        price: '',
        phone: '',
        email: '',
        imageUrl: '',
        operatingHours: '',
        fieldCount: '',
        fields: '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      price: formData.price ? Number(formData.price) : undefined,
      fieldCount: formData.fieldCount ? Number(formData.fieldCount) : undefined,
      fields: formData.fields.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n) && n > 0),
    };
    // Boş stringleri undefined yapalım ki backend'de sorun olmasın veya varsayılan değerler kullanılsın
    Object.keys(dataToSubmit).forEach(key => {
      if (dataToSubmit[key] === '') {
        dataToSubmit[key] = undefined;
      }
      // Backend'de fieldCount ve price zorunlu olabilir, bu yüzden boşsa 0 gönderilebilir veya validasyon eklenebilir.
      // Şimdilik backend'in bu durumu nasıl ele aldığına göre hareket ediyoruz.
    });
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Saha Adı <span className="text-red-500">*</span></label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Konum (İlçe/Semt) <span className="text-red-500">*</span></label>
        <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Açık Adres <span className="text-red-500">*</span></label>
        <textarea name="address" id="address" value={formData.address} onChange={handleChange} rows="3" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Fiyat (TL/saat) <span className="text-red-500">*</span></label>
          <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefon</label>
          <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-posta</label>
        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Resim URL</label>
        <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="operatingHours" className="block text-sm font-medium text-gray-700">Çalışma Saatleri (örn: 09:00 - 23:00)</label>
        <input type="text" name="operatingHours" id="operatingHours" value={formData.operatingHours} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fieldCount" className="block text-sm font-medium text-gray-700">Tesisteki Alt Saha Sayısı</label>
          <input type="number" name="fieldCount" id="fieldCount" value={formData.fieldCount} onChange={handleChange} min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="fields" className="block text-sm font-medium text-gray-700">Alt Saha Numaraları (örn: 1,2,3)</label>
          <input type="text" name="fields" id="fields" value={formData.fields} onChange={handleChange} placeholder="Virgülle ayırın" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} disabled={isLoading} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg disabled:opacity-50">
          İptal
        </button>
        <button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50">
          {isLoading ? (initialData ? 'Güncelleniyor...' : 'Kaydediliyor...') : (initialData ? 'Güncelle' : 'Kaydet')}
        </button>
      </div>
    </form>
  );
};

export default FieldForm;
