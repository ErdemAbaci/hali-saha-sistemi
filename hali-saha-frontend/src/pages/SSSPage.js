import React, { useState } from 'react';
import { 
  FaSearch, 
  FaChevronDown, 
  FaChevronUp, 
  FaPhone, 
  FaEnvelope, 
  FaQuestionCircle,
  FaCreditCard,
  FaCalendarAlt,
  FaFutbol
} from 'react-icons/fa';

function SSSPage() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      id: 'genel',
      title: 'Genel Sorular',
      icon: <FaQuestionCircle className="mr-2" />,
      questions: [
        {
          question: 'Halı saha rezervasyonu nasıl yapılır?',
          answer: 'Ana sayfamızdan veya "Sahalar" bölümünden istediğiniz sahayı seçin, tarih ve saat aralığını belirleyin, ödeme işlemini tamamlayın. Rezervasyon onayınız e-posta ve SMS olarak iletilecektir.'
        },
        {
          question: 'Rezervasyonumu nasıl iptal edebilirim?',
          answer: 'Hesabınızdan "Rezervasyonlarım" bölümüne giderek ilgili rezervasyonu seçip iptal edebilirsiniz. İptal koşulları için lütfen iptal politikamızı inceleyin.'
        },
        {
          question: 'Üyelik ücretli mi?',
          answer: 'Hayır, halı saha rezervasyon platformumuz tamamen ücretsizdir. Sadece saha kiralama ücreti ödersiniz.'
        },
        {
          question: 'Hangi saatler arasında rezervasyon yapabilirim?',
          answer: 'Saha müsaitliğine bağlı olarak 08:00 - 24:00 saatleri arasında rezervasyon yapabilirsiniz. Bazı sahaların çalışma saatleri farklılık gösterebilir.'
        }
      ]
    },
    {
      id: 'odeme',
      title: 'Ödeme İşlemleri',
      icon: <FaCreditCard className="mr-2" />,
      questions: [
        {
          question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
          answer: 'Tüm kredi ve banka kartları ile güvenli ödeme yapabilirsiniz. Ayrıca bazı sahalarımızda nakit ödeme seçeneği de mevcuttur.'
        },
        {
          question: 'Ödemem güvenli mi?',
          answer: 'Evet, tüm ödemeler 256-bit SSL şifreleme ile güvence altındadır. Kredi kartı bilgileriniz asla sistemimizde saklanmaz.'
        },
        {
          question: 'Faturamı nasıl alabilirim?',
          answer: 'Ödeme işleminizin ardından e-posta adresinize elektronik fatura gönderilir. Ayrıca hesabınızdan geçmiş siparişlerinize ulaşarak faturalarınıza erişebilirsiniz.'
        },
        {
          question: 'İptal durumunda ödeme iadesi nasıl yapılıyor?',
          answer: 'İptal işlemi yapıldıktan sonra, iade tutarı kullanılan ödeme yöntemine 3-5 iş günü içerisinde yansıtılır. Bankanızın işlem süreleri değişiklik gösterebilir.'
        }
      ]
    },
    {
      id: 'rezervasyon',
      title: 'Rezervasyon İşlemleri',
      icon: <FaCalendarAlt className="mr-2" />,
      questions: [
        {
          question: 'Rezervasyon yaptıktan sonra iptal hakkım var mı?',
          answer: 'Evet, oyun saatinizden en az 24 saat önce yapılan iptallerde ücret iadesi yapılmaktadır. Daha geç yapılan iptallerde iade yapılmamaktadır.'
        },
        {
          question: 'Rezervasyonumda değişiklik yapabilir miyim?',
          answer: 'Evet, rezervasyonunuzu hesabınızdan düzenleyebilir veya iptal edip yeni bir rezervasyon oluşturabilirsiniz. Değişiklikler saha müsaitliğine bağlıdır.'
        },
        {
          question: 'Rezervasyon onayımı nasıl alacağım?',
          answer: 'Rezervasyon onayınız belirttiğiniz e-posta adresine ve telefon numaranıza anında gönderilir. Ayrıca hesabınızdan da rezervasyon detaylarınıza ulaşabilirsiniz.'
        },
        {
          question: 'Rezervasyon yaptırdığım saha müsait değilse ne olacak?',
          answer: 'Böyle bir durumla karşılaşmanız durumunda derhal sizinle iletişime geçilecek ve alternatif çözümler sunulacaktır. Gerekirse ücret iadeniz yapılacaktır.'
        }
      ]
    },
    {
      id: 'saha-ozellikleri',
      title: 'Saha Özellikleri',
      icon: <FaFutbol className="mr-2" />,
      questions: [
        {
          question: 'Sahalarda duş ve soyunma odası var mı?',
          answer: 'Evet, tüm sahalarımızda duş ve soyunma odaları mevcuttur. Ancak bazı sahalarda bu hizmetler ek ücrete tabi olabilir.'
        },
        {
          question: 'Sahada kiralayabileceğim ekipmanlar var mı?',
          answer: 'Evet, çoğu sahamızda krampon, kaleci eldiveni, forma gibi ekipmanları kiralayabilirsiniz. Detaylar için ilgili saha sayfasını inceleyebilirsiniz.'
        },
        {
          question: 'Sahada otopark imkanı var mı?',
          answer: 'Evet, tesislerimizin çoğunda ücretsiz otopark imkanı mevcuttur. Ancak bazı şubelerimizde otopark sınırlı sayıda olabilir.'
        },
        {
          question: 'Engelli erişimi mevcut mu?',
          answer: 'Evet, tüm tesislerimiz engelli erişimine uygundur. Özel ihtiyaçlarınız için lütfen rezervasyon öncesinde bizimle iletişime geçin.'
        }
      ]
    }
  ];

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: searchQuery
      ? category.questions.filter(
          q => q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
               q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : category.questions
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Sıkça Sorulan Sorular</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Müşterilerimizden sıkça gelen sorular ve yanıtları aşağıda listelenmiştir. 
            Aradığınız yanıtı bulamazsanız bize ulaşmaktan çekinmeyin.
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
              placeholder="Sorunuzu yazın..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6 flex items-center">
                  {category.icon}
                  {category.title}
                </h2>
                
                <div className="space-y-4">
                  {category.questions.map((item, index) => {
                    const isActive = activeIndex === `${category.id}-${index}`;
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          className={`w-full px-6 py-4 text-left flex justify-between items-center ${isActive ? 'bg-gray-50' : 'bg-white'}`}
                          onClick={() => toggleQuestion(`${category.id}-${index}`)}
                        >
                          <span className="font-medium text-gray-900">{item.question}</span>
                          {isActive ? (
                            <FaChevronUp className="text-gray-400" />
                          ) : (
                            <FaChevronDown className="text-gray-400" />
                          )}
                        </button>
                        {isActive && (
                          <div className="px-6 pb-4 pt-2 bg-gray-50">
                            <p className="text-gray-600">{item.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still Need Help Section */}
        <div className="mt-16 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-8 py-12 text-center">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">Hala yardıma mı ihtiyacınız var?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Sorularınız için 7/24 destek ekibimiz yanınızda. Aşağıdaki iletişim bilgilerimizden bize ulaşabilirsiniz.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a
                href="tel:+908501234567"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FaPhone className="-ml-1 mr-2 h-5 w-5" />
                0850 123 23 23
              </a>
              <a
                href="mailto:destek@halisaha.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FaEnvelope className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                E-posta Gönder
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SSSPage;
