import React, { useState } from 'react';
import { 
  FaSearch, 
  FaPhone, 
  FaEnvelope, 
  FaQuestionCircle, 
  FaClock, 
  FaMapMarkerAlt, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaCreditCard,
  FaCalendarAlt,
  FaYoutube 
} from 'react-icons/fa';

function HelpCenterPage() {
  const [activeCategory, setActiveCategory] = useState('genel');
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = {
    genel: [
      {
        question: 'Üyelik nasıl oluşturulur?',
        answer: 'Ana sayfadaki "Üye Ol" butonuna tıklayarak ad, soyad, e-posta ve şifre bilgilerinizi doldurup üyeliğinizi oluşturabilirsiniz.'
      },
      {
        question: 'Şifremi unuttum, ne yapmalıyım?',
        answer: 'Giriş sayfasındaki "Şifremi Unuttum" bağlantısına tıklayarak e-posta adresinizi girin. Size şifre sıfırlama bağlantısı göndereceğiz.'
      },
      {
        question: 'Hesabımı nasıl silebilirim?',
        answer: 'Hesap ayarlarınızdan hesabınızı kalıcı olarak silebilirsiniz. Bu işlem geri alınamaz.'
      }
    ],
    rezervasyon: [
      {
        question: 'Rezervasyonumu nasıl iptal ederim?',
        answer: 'Hesabınızdan "Rezervasyonlarım" bölümüne giderek ilgili rezervasyonu seçip iptal edebilirsiniz.'
      },
      {
        question: 'Rezervasyon ücreti iade politikası nedir?',
        answer: 'İptal işlemini oyun saatinizden en az 24 saat önce yapmanız durumunda ücret iadeniz yapılır.'
      },
      {
        question: 'Rezervasyon yaparken kupon kodu nasıl kullanırım?',
        answer: 'Ödeme sayfasında "Kupon Kodu" bölümüne kupon kodunuzu girerek indiriminizi uygulayabilirsiniz.'
      }
    ],
    odeme: [
      {
        question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
        answer: 'Tüm kredi/banka kartları ile ödeme yapabilirsiniz. Ayrıca bazı sahalarımızda nakit ödeme seçeneği de mevcuttur.'
      },
      {
        question: 'Ödeme güvenli mi?',
        answer: 'Evet, tüm ödemeler 256-bit SSL şifreleme ile güvence altındadır. Kredi kartı bilgileriniz asla sistemimizde saklanmaz.'
      },
      {
        question: 'Fatura bilgilerimi nasıl güncelleyebilirim?',
        answer: 'Hesap ayarlarınızdan fatura bilgilerinizi güncelleyebilirsiniz.'
      }
    ]
  };

  const filteredFaqs = Object.entries(faqCategories).reduce((acc, [category, faqs]) => {
    if (searchQuery) {
      const filtered = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
    } else if (activeCategory === category) {
      acc[category] = faqs;
    }
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Yardım Merkezi</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Size nasıl yardımcı olabiliriz? Aşağıdaki arama kutusunu kullanarak veya kategorilerden birini seçerek başlayın.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Yardım merkezinde ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        {!searchQuery && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { id: 'genel', name: 'Genel Sorular', icon: <FaQuestionCircle className="mr-2" /> },
              { id: 'rezervasyon', name: 'Rezervasyon', icon: <FaClock className="mr-2" /> },
              { id: 'odeme', name: 'Ödeme İşlemleri', icon: <FaCreditCard className="mr-2" /> },
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-6 py-3 rounded-full font-medium transition-colors ${activeCategory === category.id ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto space-y-6 mb-16">
          {Object.entries(filteredFaqs).map(([category, faqs]) => (
            <div key={category} className="space-y-4">
              {searchQuery && (
                <h2 className="text-2xl font-heading font-bold text-gray-900 capitalize">
                  {category === 'genel' ? 'Genel Sorular' : category === 'rezervasyon' ? 'Rezervasyon' : 'Ödeme İşlemleri'}
                </h2>
              )}
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-8 py-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-3">Hala yardıma mı ihtiyacınız var?</h2>
              <p className="text-xl text-gray-600">İletişim ekibimiz size yardımcı olmaktan mutluluk duyar</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600 mb-4">
                  <FaPhone className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Bizi Arayın</h3>
                <p className="text-gray-600">0850 123 45 67</p>
                <p className="text-sm text-gray-500 mt-1">Pazartesi - Cumartesi 09:00 - 18:00</p>
              </div>
              
              <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600 mb-4">
                  <FaEnvelope className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">E-posta Gönderin</h3>
                <p className="text-gray-600">destek@halisaha.com</p>
                <p className="text-sm text-gray-500 mt-1">En geç 24 saat içinde yanıt veriyoruz</p>
              </div>
              
              <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600 mb-4">
                  <FaMapMarkerAlt className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Ofisimizi Ziyaret Edin</h3>
                <p className="text-gray-600">Halı Saha Caddesi No:123</p>
                <p className="text-sm text-gray-500 mt-1">İstanbul / Türkiye</p>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Bizi Takip Edin</h3>
              <div className="flex justify-center space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Facebook</span>
                  <FaFacebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <FaTwitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Instagram</span>
                  <FaInstagram className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpCenterPage;