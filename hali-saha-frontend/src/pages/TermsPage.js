import React from 'react';
import { FaFileContract, FaUserShield, FaExclamationTriangle, FaQuestionCircle, FaBalanceScale } from 'react-icons/fa';

function TermsPage() {
  const sections = [
    {
      icon: <FaFileContract className="text-primary-600 text-2xl" />,
      title: 'Kullanım Koşulları',
      content: (
        <div className="space-y-4">
          <p>
            Halı Saha Rezervasyon Sistemi'ni ("Platform") kullanmadan önce bu Kullanım Koşullarını dikkatle okuyunuz. Platformu kullanmanız, bu koşulları kabul ettiğiniz anlamına gelir. Eğer bu koşulları kabul etmiyorsanız, lütfen Platformu kullanmayınız.
          </p>
          <p>
            Platform, kullanıcılarına halı saha rezervasyonu yapma imkanı sunan bir çevrimiçi hizmettir. Hizmetlerimizden yararlanabilmek için 18 yaşını doldurmuş olmanız veya yasal temsilcinizin onayına sahip olmanız gerekmektedir.
          </p>
        </div>
      )
    },
    {
      icon: <FaUserShield className="text-primary-600 text-2xl" />,
      title: 'Hesap Sorumluluğu',
      content: (
        <div className="space-y-4">
          <ul className="list-disc pl-6 space-y-2">
            <li>Hesap bilgilerinizin güvenliğinden siz sorumlusunuz.</li>
            <li>Hesabınız üzerinden yapılan tüm işlemlerden siz sorumlu olacaksınız.</li>
            <li>Şüpheli herhangi bir etkinlik fark ederseniz derhal bizimle iletişime geçiniz.</li>
            <li>Hesabınızı başkalarıyla paylaşmayınız.</li>
          </ul>
        </div>
      )
    },
    {
      icon: <FaExclamationTriangle className="text-primary-600 text-2xl" />,
      title: 'Yasaklı Faaliyetler',
      content: (
        <div className="space-y-4">
          <p>Aşağıdaki faaliyetler kesinlikle yasaktır:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Platformu yasa dışı amaçlarla kullanmak</li>
            <li>Diğer kullanıcıları rahatsız etmek veya taciz etmek</li>
            <li>Sahte veya yanıltıcı bilgi vermek</li>
            <li>Platformun çalışmasını engelleyecek veya yavaşlatacak faaliyetlerde bulunmak</li>
            <li>Telif hakkıyla korunan içerikleri izinsiz paylaşmak</li>
          </ul>
        </div>
      )
    },
    {
      icon: <FaBalanceScale className="text-primary-600 text-2xl" />,
      title: 'Sorumluluk Reddi',
      content: (
        <div className="space-y-4">
          <p>
            Platform "olduğu gibi" ve "mümkün olduğu ölçüde" sunulmaktadır. Platformun kesintisiz, güvenli veya hatasız olacağını garanti etmiyoruz. Platformun kullanımından doğabilecek herhangi bir zarardan sorumlu değiliz.
          </p>
          <p>
            Rezervasyon yaptığınız sahanın durumu, özellikleri veya hizmet kalitesi ile ilgili olarak herhangi bir sorumluluk kabul etmiyoruz.
          </p>
        </div>
      )
    },
    {
      icon: <FaQuestionCircle className="text-primary-600 text-2xl" />,
      title: 'Değişiklikler ve Güncellemeler',
      content: (
        <div className="space-y-4">
          <p>
            Bu Kullanım Koşullarını istediğimiz zaman değiştirme hakkını saklı tutarız. Değişiklikler yürürlüğe girdiğinde, Platformu kullanmaya devam etmeniz değişiklikleri kabul ettiğiniz anlamına gelir. Önemli değişiklikler için sizi önceden bilgilendireceğiz.
          </p>
          <p>
            Son güncelleme: 02 Haziran 2025
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Kullanım Koşulları</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Halı Saha Rezervasyon Sistemi'ni kullanmadan önce lütfen aşağıdaki kullanım koşullarını dikkatle okuyunuz.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Son Güncelleme: 02 Haziran 2025
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0">
                    {section.icon}
                  </div>
                  <h2 className="ml-3 text-2xl font-heading font-bold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <div className="prose max-w-none text-gray-600">
                  {section.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-8 py-12 text-center">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">Sorularınız mı var?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Kullanım koşullarıyla ilgili herhangi bir sorunuz varsa, lütfen bizimle iletişime geçmekten çekinmeyin.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a
                href="/iletisim"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                İletişime Geçin
              </a>
              <a
                href="/yardim-merkezi"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Yardım Merkezi
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;