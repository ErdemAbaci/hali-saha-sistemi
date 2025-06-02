import React from 'react';
import { 
  FaShieldAlt, 
  FaLock, 
  FaUserShield, 
  FaInfoCircle,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube
} from 'react-icons/fa';

function GizlilikPage() {
  const privacySections = [
    {
      icon: <FaShieldAlt className="text-primary-600 text-2xl" />,
      title: 'Kişisel Verilerin İşlenmesi',
      content: (
        <div className="space-y-4">
          <p>
            Halı Saha Rezervasyon Sistemi olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, kişisel verilerinizin güvenliğine büyük önem vermekteyiz. Bu kapsamda, kişisel verileriniz;
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Hukuka ve dürüstlük kurallarına uygun olarak işlenmektedir.</li>
            <li>Doğru ve güncel olarak saklanmaktadır.</li>
            <li>Belirli, açık ve meşru amaçlar doğrultusunda işlenmektedir.</li>
            <li>İşlendikleri amaçla bağlantılı, sınırlı ve ölçülü olarak işlenmektedir.</li>
            <li>İlgili mevzuatta öngörülen veya işlendikleri amaç için gerekli olan süre kadar muhafaza edilmektedir.</li>
          </ul>
        </div>
      )
    },
    {
      icon: <FaLock className="text-primary-600 text-2xl" />,
      title: 'Veri Güvenliği',
      content: (
        <div className="space-y-4">
          <p>
            Kişisel verileriniz, yetkisiz erişim, hırsızlık veya kötüye kullanım gibi risklere karşı uygun güvenlik düzeyini temin etmeye yönelik gerekli teknik ve idari tedbirler alınarak korunmaktadır.
          </p>
          <p>
            Web sitemizde 256 bit SSL şifreleme teknolojisi kullanılarak veri güvenliği sağlanmaktadır. Ödeme işlemleriniz sırasında kredi kartı bilgileriniz hiçbir şekilde sunucularımızda saklanmamakta, ödeme altyapı hizmeti veren kuruluşlar aracılığıyla işlenmektedir.
          </p>
        </div>
      )
    },
    {
      icon: <FaUserShield className="text-primary-600 text-2xl" />,
      title: 'Veri Sahibinin Hakları',
      content: (
        <div className="space-y-4">
          <p>KVKK'nın 11. maddesi uyarınca herkes, veri sorumlusuna başvurarak aşağıdaki haklarını kullanabilir:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Kişisel veri işlenip işlenmediğini öğrenme,</li>
            <li>Kişisel verileri işlenmişse buna ilişkin bilgi talep etme,</li>
            <li>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
            <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</li>
            <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
            <li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme,</li>
            <li>Düzeltme, silme veya yok edilme işlemlerinin, kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
            <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme,</li>
            <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde zararın giderilmesini talep etme haklarına sahiptir.</li>
          </ul>
        </div>
      )
    },
    {
      icon: <FaInfoCircle className="text-primary-600 text-2xl" />,
      title: 'Çerez Politikası',
      content: (
        <div className="space-y-4">
          <p>
            Web sitemizde çerezler (cookies) kullanılmaktadır. Çerezler, web sitemizi ziyaret ettiğinizde tarayıcınız aracılığıyla bilgisayarınıza veya mobil cihazınıza kaydedilen küçük metin dosyalarıdır. Bu dosyalar, web sitemizi daha verimli hale getirmek, güvenliği artırmak ve kullanıcı deneyiminizi iyileştirmek amacıyla kullanılmaktadır.
          </p>
          <p>
            Çerez türleri ve amaçları şunlardır:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Zorunlu Çerezler:</strong> Web sitemizin temel işlevlerini çalıştırmak için gereklidir.</li>
            <li><strong>Performans Çerezleri:</strong> Ziyaretçi trafik istatistiklerini toplamak ve web sitemizin performansını analiz etmek için kullanılır.</li>
            <li><strong>İşlevsellik Çerezleri:</strong> Tercihlerinizi hatırlayarak size daha kişiselleştirilmiş bir deneyim sunar.</li>
            <li><strong>Hedefleme Çerezleri:</strong> İlgi alanlarınıza göre reklamlar göstermek için kullanılır.</li>
          </ul>
          <p>
            Tarayıcı ayarlarınızı değiştirerek çerezleri reddedebilir veya çerez kullanımını sınırlandırabilirsiniz. Ancak bu durumda web sitemizin bazı özellikleri düzgün çalışmayabilir.
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
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Gizlilik Politikası</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Halı Saha Rezervasyon Sistemi olarak, gizliliğinize ve kişisel verilerinizin güvenliğine büyük önem veriyoruz.
            Aşağıda, verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu detaylı bir şekilde açıklıyoruz.
          </p>
        </div>

        {/* Last Updated */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-12">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaInfoCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Son Güncelleme:</strong> 02 Haziran 2025
              </p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">Giriş</h2>
          <div className="prose max-w-none text-gray-600 space-y-4">
            <p>
              Halı Saha Rezervasyon Sistemi ("Biz" veya "Şirket") olarak, web sitemizi ("Site") ziyaret edenlerin ve hizmetlerimizi kullananların ("Kullanıcı" veya "Siz") gizliliğini korumayı taahhüt ediyoruz. Bu Gizlilik Politikası, kişisel verilerinizin nasıl toplandığını, kullanıldığını, paylaşıldığını ve korunduğunu açıklamaktadır.
            </p>
            <p>
              Bu politikayı dikkatle okumanızı ve kişisel verilerinizin işlenmesine ilişkin haklarınızı ve yükümlülüklerinizi anlamanızı önemle rica ederiz. Sitemizi kullanarak, bu Gizlilik Politikasında açıklanan uygulamaları kabul etmiş olursunuz.
            </p>
          </div>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {privacySections.map((section, index) => (
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

        {/* Contact Information */}
        <div className="mt-16 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-8 py-12 text-center">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">İletişim</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Gizlilik politikamızla ilgili herhangi bir sorunuz veya endişeniz varsa, lütfen aşağıdaki iletişim bilgilerimizden bize ulaşmaktan çekinmeyin.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Adres</h3>
                <p className="text-gray-600">Halı Saha Caddesi No:123</p>
                <p className="text-gray-600">Kadıköy, İstanbul / Türkiye</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">İletişim</h3>
                <p className="text-gray-600">Telefon: +90 850 123 45 67</p>
                <p className="text-gray-600">E-posta: kvkk@halisaha.com</p>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                Bu Gizlilik Politikası en son 02 Haziran 2025 tarihinde güncellenmiştir. Önemli değişiklikler yapıldığında, bu sayfayı güncelleyeceğiz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GizlilikPage;
