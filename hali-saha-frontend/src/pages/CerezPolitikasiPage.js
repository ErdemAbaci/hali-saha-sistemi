import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Info } from 'lucide-react';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

function CerezPolitikasiPage() {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-10 rounded-xl shadow-lg">
        <div className="text-center mb-10">
          <ShieldCheck className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Çerez Politikası
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Web sitemizde daha iyi bir kullanıcı deneyimi sunmak için çerezleri nasıl kullandığımızı öğrenin.
          </p>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center">
              <Info className="w-6 h-6 mr-2 text-primary-500" /> Giriş
            </h2>
            <p>
              Bu Çerez Politikası, web sitemizi ziyaret ettiğinizde çerezleri ve benzer teknolojileri nasıl kullandığımızı açıklamaktadır.
              Web sitemizi kullanarak, bu politikada açıklanan şekilde çerez kullanımını kabul etmiş olursunuz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center">
              <Info className="w-6 h-6 mr-2 text-primary-500" /> Çerez Nedir?
            </h2>
            <p>
              Çerezler, bir web sitesini ziyaret ettiğinizde bilgisayarınıza veya mobil cihazınıza indirilen küçük metin dosyalarıdır.
              Web sitelerinin çalışmasını veya daha verimli çalışmasını sağlamak ve web sitesi sahiplerine bilgi sağlamak için yaygın olarak kullanılırlar.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center">
              <Info className="w-6 h-6 mr-2 text-primary-500" /> Hangi Tür Çerezleri Kullanıyoruz?
            </h2>
            <p>
              Web sitemizde aşağıdaki çerez türlerini kullanabiliriz:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
              <li>
                <strong>Zorunlu Çerezler:</strong> Bu çerezler, web sitemizin temel işlevlerini yerine getirmesi için gereklidir.
                Örneğin, güvenli alanlara erişim veya alışveriş sepeti işlevselliği gibi.
              </li>
              <li>
                <strong>Performans Çerezleri:</strong> Bu çerezler, ziyaretçilerin web sitemizi nasıl kullandığı hakkında anonim bilgi toplar.
                Örneğin, en çok ziyaret edilen sayfalar veya hata mesajları gibi. Bu bilgiler, web sitemizin performansını iyileştirmek için kullanılır.
              </li>
              <li>
                <strong>İşlevsellik Çerezleri:</strong> Bu çerezler, web sitemizin yaptığınız seçimleri (kullanıcı adı, dil veya bölge gibi) hatırlamasını ve gelişmiş, daha kişisel özellikler sunmasını sağlar.
              </li>
              <li>
                <strong>Hedefleme/Reklam Çerezleri:</strong> Bu çerezler, ilgi alanlarınıza daha uygun reklamlar sunmak için kullanılır.
                Ayrıca bir reklamı görme sayınızı sınırlamak ve reklam kampanyasının etkinliğini ölçmeye yardımcı olmak için de kullanılırlar.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center">
              <Info className="w-6 h-6 mr-2 text-primary-500" /> Çerezleri Nasıl Kontrol Edebilirsiniz?
            </h2>
            <p>
              Çerezleri istediğiniz gibi kontrol edebilir ve/veya silebilirsiniz. Tarayıcı ayarlarınızı değiştirerek çerezleri engelleyebilir veya silebilirsiniz.
              Ancak, çerezleri engellemek veya silmek, web sitemizin bazı özelliklerinin düzgün çalışmamasına neden olabilir.
              Çoğu tarayıcı, çerezleri kabul etme, reddetme veya silme seçenekleri sunar. Bu ayarlar genellikle tarayıcınızın 'seçenekler' veya 'tercihler' menüsünde bulunur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center">
              <Info className="w-6 h-6 mr-2 text-primary-500" /> Politikadaki Değişiklikler
            </h2>
            <p>
              Bu Çerez Politikasını zaman zaman güncelleyebiliriz. Politikada yapılan önemli değişiklikleri web sitemizde yayınlayarak sizi bilgilendireceğiz.
              Değişiklikler yayınlandıktan sonra web sitemizi kullanmaya devam etmeniz, güncellenmiş politikayı kabul ettiğiniz anlamına gelir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center">
              <Info className="w-6 h-6 mr-2 text-primary-500" /> İletişim
            </h2>
            <p>
              Çerez politikamız hakkında herhangi bir sorunuz varsa, lütfen İletişim sayfamızdaki bilgiler aracılığıyla bizimle iletişime geçin.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Son Güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default CerezPolitikasiPage;
