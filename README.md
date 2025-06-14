Halı Saha Otomasyon Sistemi (Web)
Bu proje, halı saha işletmeleri için randevu yönetimi, müşteri takibi, abonelik sistemleri ve finansal işlemleri dijitalleştirmeyi amaçlayan modern bir web uygulamasıdır. React, Node.js, Express ve MongoDB (MERN) teknolojileri kullanılarak geliştirilmiştir.


📖 Proje Hakkında
Geleneksel yöntemlerle (defter, telefon) yönetilen halı saha operasyonları, zaman kaybına, hatalı randevu kayıtlarına ve gelir takibinde zorluklara yol açabilmektedir. Bu web tabanlı otomasyon sistemi, tüm bu süreçleri tek bir platformda toplayarak işletme verimliliğini artırmayı, insan kaynaklı hataları en aza indirmeyi ve detaylı raporlama ile işletme sahiplerine stratejik kararlar alma imkanı sunmayı hedefler.


✨ Temel Özellikler
Proje, bir halı saha işletmesinin tüm ihtiyaçlarını karşılayacak modüler bir yapıya sahiptir:

• 👤 Müşteri Yönetimi:
o Yeni müşteri kaydı oluşturma, mevcut müşterileri listeleme ve bilgilerini güncelleme.
o Müşterilerin geçmiş randevu ve ödeme kayıtlarına kolayca erişim.


• 📅 Randevu ve Saha Yönetimi:
o İnteraktif bir takvim üzerinden boş ve dolu saatleri görüntüleme.
o Yeni randevu oluşturma, düzenleme ve iptal etme.
o Farklı sahaları ve saatlik ücretlerini yönetme.


• 📦 Hizmet ve Abonelik Sistemi:
o Müşteriler için aylık veya dönemsel abonelik paketleri oluşturma ve yönetme.


• 👥 Personel ve Yetki Yönetimi:
o Personel bilgilerini kaydetme ve listeleme.
o Rol bazlı (admin,operator,customer) kullanıcı girişi ve yetkilendirme.


🛠️ Kullanılan Teknolojiler
• Frontend: React, React Router, Axios, Tailwind CSS, Stripe
• Backend: Node.js, Express.js , bcryptjs, Stripe
• Veritabanı: MongoDB (Mongoose ile)
• Kimlik Doğrulama: JSON Web Tokens (JWT)
• Paket Yöneticisi: npm


🚀 Kurulum ve Başlatma
Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:
Ön Gereksinimler
• Node.js ve npm'in yüklü olması gerekmektedir.
• Bir MongoDB veritabanı erişiminiz olmalı (Lokal veya MongoDB Atlas üzerinden).

Kurulum Adımları
1. Repoyu Klonlayın:
2. git clone https://github.com/ErdemAbaci/hali-saha-sistemi.git
3. cd hali-saha-sistemi

4. Backend'i Ayarlayın:
o Backend klasörüne gidin (örneğin server veya backend).
o Gerekli paketleri yükleyin:
o npm install

o Bir .env dosyası oluşturun ve aşağıdaki gibi MongoDB bağlantı cümlenizi ve JWT anahtarınızı ekleyin:
o MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
o JWT_SECRET=gizli_bir_anahtar
o PORT=5000
STRIPE API KEYLERİ, GOOGLE MAPS API
o Backend sunucusunu başlatın:
o npm start

5. Frontend'i Ayarlayın:
o Yeni bir terminal açın ve frontend klasörüne gidin (örneğin client veya frontend).
o Gerekli paketleri yükleyin:
o npm install

o Frontend uygulamasını başlatın:
o npm start

o Uygulama varsayılan olarak http://localhost:3000 adresinde açılacaktır.

📫 İletişim
Erdem Abacı - https://github.com/ErdemAbaci
Huseyin Üzüm - [huseyinuzum](https://github.com/huseyinuzum)
Proje Linki: https://github.com/ErdemAbaci/hali-saha-sistemi

