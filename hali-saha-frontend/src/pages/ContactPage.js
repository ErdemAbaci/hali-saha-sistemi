import React, { useState } from 'react';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock, 
  FaPaperPlane, 
  FaCheckCircle,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube
} from 'react-icons/fa';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      // Hide success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">İletişime Geçin</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sorularınız, önerileriniz veya geri bildirimleriniz için bize ulaşın. Size en kısa sürede dönüş yapacağız.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-8 h-full">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">İletişim Bilgileri</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary-100 rounded-lg p-3">
                    <FaMapMarkerAlt className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Adres</h3>
                    <p className="mt-1 text-gray-600">Halı Saha Caddesi No:123</p>
                    <p className="text-gray-600">Kadıköy, İstanbul / Türkiye</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary-100 rounded-lg p-3">
                    <FaPhone className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Telefon</h3>
                    <p className="mt-1 text-gray-600">+90 850 123 45 67</p>
                    <p className="text-gray-600">+90 555 123 45 67 (WhatsApp)</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary-100 rounded-lg p-3">
                    <FaEnvelope className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">E-posta</h3>
                    <p className="mt-1 text-gray-600">info@halisaha.com</p>
                    <p className="text-gray-600">destek@halisaha.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary-100 rounded-lg p-3">
                    <FaClock className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Çalışma Saatleri</h3>
                    <p className="mt-1 text-gray-600">Pazartesi - Cuma: 09:00 - 18:00</p>
                    <p className="text-gray-600">Cumartesi: 10:00 - 16:00</p>
                    <p className="text-gray-600">Pazar: Kapalı</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Bizi Takip Edin</h3>
                <div className="flex space-x-4">
                  {[
                    { name: 'Facebook', icon: 'FaFacebook', url: '#' },
                    { name: 'Twitter', icon: 'FaTwitter', url: '#' },
                    { name: 'Instagram', icon: 'FaInstagram', url: '#' },
                    { name: 'YouTube', icon: 'FaYoutube', url: '#' },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      className="text-gray-400 hover:text-primary-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="sr-only">{social.name}</span>
                      {React.createElement(require('react-icons/fa')[social.icon], {
                        className: 'h-6 w-6',
                        'aria-hidden': 'true'
                      })}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-96">
              <iframe
                title="Halı Saha Konumumuz"
                className="w-full h-full"
                frameBorder="0"
                style={{ border: 0 }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.279856019132!2d29.00832031541191!3d41.00813777929972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caba6c5d5ec7f9%3A0x3f4a3bbd7d1e1b3d!2sKad%C4%B1k%C3%B6y%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1620000000000!5m2!1str!2str"
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">Bize Yazın</h2>
            
            {isSubmitted ? (
              <div className="rounded-md bg-green-50 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaCheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Mesajınız başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Adınız Soyadınız <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="py-3 px-4 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
              </div>


              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-posta Adresiniz <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="py-3 px-4 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Konu <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="py-3 px-4 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Konu başlığı"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Mesajınız <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="py-3 px-4 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Mesajınızı buraya yazın..."
                    defaultValue={''}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <FaPaperPlane className="mr-2 -ml-1 h-5 w-5" />
                  {isSubmitting ? 'Gönderiliyor...' : 'Mesajı Gönder'}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sık Sorulan Sorular</h3>
              <p className="text-gray-600 mb-4">
                Sık sorulan sorulara hızlıca yanıt bulmak için yardım merkezimizi ziyaret edin.
              </p>
              <a
                href="/yardim-merkezi"
                className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium"
              >
                Yardım Merkezi'ne Git
                <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;