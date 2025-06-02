import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Shield,
  HelpCircle,
  MessageSquare
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Hızlı Erişim',
      links: [
        { name: 'Ana Sayfa', to: '/' },
        { name: 'Saha Ara', to: '/sahalar' },
        { name: 'Nasıl Çalışır?', to: '/nasil-calisir' },
        { name: 'Sık Sorulan Sorular', to: '/sss' },
      ],
    },
    {
      title: 'Şirket',
      links: [
        { name: 'Hakkımızda', to: '/hakkimizda' },
        { name: 'Kariyer', to: '/kariyer' },
        { name: 'Blog', to: '/blog' },
        { name: 'Basın', to: '/basin' },
      ],
    },
    {
      title: 'Yardım',
      links: [
        { name: 'Yardım Merkezi', to: '/yardim' },
        { name: 'İletişim', to: '/iletisim' },
        { name: 'Gizlilik Politikası', to: '/gizlilik' },
        { name: 'Kullanım Koşulları', to: '/kullanim-kosullari' },
      ],
    },
  ];

  const contactInfo = [
    { 
      icon: <MapPin className="h-5 w-5 text-primary-600" />, 
      text: '1234 Halı Saha Caddesi, İstanbul, Türkiye' 
    },
    { 
      icon: <Phone className="h-5 w-5 text-primary-600" />, 
      text: '+90 555 123 45 67' 
    },
    { 
      icon: <Mail className="h-5 w-5 text-primary-600" />, 
      text: 'info@halisahabul.com' 
    },
    { 
      icon: <Clock className="h-5 w-5 text-primary-600" />, 
      text: 'Hafta İçi: 09:00 - 22:00 | Hafta Sonu: 08:00 - 23:00' 
    },
  ];

  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: <Facebook className="h-5 w-5" />, 
      url: 'https://facebook.com/halisahabul' 
    },
    { 
      name: 'Twitter', 
      icon: <Twitter className="h-5 w-5" />, 
      url: 'https://twitter.com/halisahabul' 
    },
    { 
      name: 'Instagram', 
      icon: <Instagram className="h-5 w-5" />, 
      url: 'https://instagram.com/halisahabul' 
    },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Logo and description */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">
                Forma<span className="text-primary-600">Golü</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Halı saha rezervasyonunuzu kolayca yapın, anında onay alın ve unutulmaz 
              maçlar oynayın. Türkiye'nin dört bir yanındaki en iyi halı sahalar sizi bekliyor!
            </p>
            
            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    {item.icon}
                  </div>
                  <p className="ml-3 text-sm text-gray-600">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-600 transition-colors"
                  aria-label={social.name}
                >
                  <span className="sr-only">{social.name}</span>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="col-span-1 lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={link.to}
                        className="text-sm text-gray-600 hover:text-primary-600 transition-colors flex items-center"
                      >
                        {link.name === 'Yardım Merkezi' && (
                          <HelpCircle className="mr-2 h-4 w-4" />
                        )}
                        {link.name === 'İletişim' && (
                          <MessageSquare className="mr-2 h-4 w-4" />
                        )}
                        {link.name === 'Gizlilik Politikası' && (
                          <Shield className="mr-2 h-4 w-4" />
                        )}
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} FormaGolü. Tüm hakları saklıdır.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="/gizlilik" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                Gizlilik Politikası
              </Link>
              <Link to="/kullanim-kosullari" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                Kullanım Koşulları
              </Link>
              <Link to="/cerez-politikasi" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                Çerez Politikası
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
