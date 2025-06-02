import React from 'react';
import { 
  FaSearch, 
  FaCalendarAlt, 
  FaCreditCard, 
  FaFutbol, 
  FaUserCheck 
} from 'react-icons/fa';

function NasilCalisirPage() {
  const steps = [
    {
      icon: <FaSearch className="w-8 h-8 mb-4 text-primary-600" />,
      title: '1. Saha Ara',
      description: 'Konumunuza en yakın halı sahaları keşfedin veya arama yaparak istediğiniz özelliklerde saha bulun.'
    },
    {
      icon: <FaCalendarAlt className="w-8 h-8 mb-4 text-primary-600" />,
      title: '2. Tarih ve Saat Seçin',
      description: 'Uygun olduğunuz tarih ve saati seçerek müsaitlik durumunu kontrol edin.'
    },
    {
      icon: <FaCreditCard className="w-8 h-8 mb-4 text-primary-600" />,
      title: '3. Güvenli Ödeme',
      description: 'Hızlı ve güvenli ödeme işlemi ile rezervasyonunuzu tamamlayın.'
    },
    {
      icon: <FaFutbol className="w-8 h-8 mb-4 text-primary-600" />,
      title: '4. Oynamaya Hazırsınız',
      description: 'Rezervasyon onayınız e-posta ve SMS ile iletilecektir. Sadece sahanıza gidip eğlencenize bakın!'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Nasıl Çalışır?</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Halı saha kiralama işleminizi sadece birkaç adımda kolayca tamamlayın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
            >
              <div className="flex justify-center">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">Sık Sorulan Sorular</h2>
          <div className="space-y-6">
            {[
              {
                question: 'Rezervasyon iptali yapabilir miyim?',
                answer: 'Evet, en geç oyun saatinizden 24 saat öncesine kadar rezervasyonunuzu iptal edebilirsiniz.'
              },
              {
                question: 'Ödeme nasıl yapılıyor?',
                answer: 'Kredi/banka kartı ile online ödeme yapabilir veya teslimatta nakit ödeme seçeneğini kullanabilirsiniz.'
              },
              {
                question: 'Rezervasyon onayımı nasıl alacağım?',
                answer: 'Rezervasyon onayınız e-posta ve SMS olarak iletilir. Ayrıca hesabınız üzerinden de görüntüleyebilirsiniz.'
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a 
              href="/yardim-merkezi" 
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Daha fazla soru için yardım merkezimizi ziyaret edin →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NasilCalisirPage;