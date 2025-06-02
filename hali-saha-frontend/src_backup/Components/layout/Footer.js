import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Hızlı Linkler',
      links: [
        { name: 'Ana Sayfa', to: '/' },
        { name: 'Saha Ara', to: '/sahalar' },
        { name: 'Nasıl Çalışır?', to: '/nasil-calisir' },
        { name: 'İletişim', to: '/contact' },
      ],
    },
    {
      title: 'Hesap',
      links: [
        { name: 'Giriş Yap', to: '/login' },
        { name: 'Kayıt Ol', to: '/signup' },
        { name: 'Hesabım', to: '/account' },
        { name: 'Yardım Merkezi', to: '/help' },
      ],
    },
    {
      title: 'Şirket',
      links: [
        { name: 'Hakkımızda', to: '/about' },
        { name: 'Gizlilik Politikası', to: '/privacy' },
        { name: 'Kullanım Şartları', to: '/terms' },
        { name: 'SSS', to: '/faq' },
      ],
    },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      icon: <Facebook size={20} />,
      url: 'https://facebook.com',
    },
    {
      name: 'Twitter',
      icon: <Twitter size={20} />,
      url: 'https://twitter.com',
    },
    {
      name: 'Instagram',
      icon: <Instagram size={20} />,
      url: 'https://instagram.com',
    },
  ];

  const contactInfo = [
    {
      icon: <Mail size={18} className="text-primary-600" />,
      text: 'info@halisahabul.com',
    },
    {
      icon: <Phone size={18} className="text-primary-600" />,
      text: '+90 555 123 45 67',
    },
    {
      icon: <MapPin size={18} className="text-primary-600" />,
      text: 'İstanbul, Türkiye',
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <span className="text-white text-xl font-bold">HaliSahaBul</span>
            </div>
            <p className="text-gray-400 text-sm">
              En iyi halı sahalara kolayca ulaşın ve rezervasyon yapın. Spor yapmanın en pratik yolu.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-white font-semibold text-lg">İletişim</h3>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index + 0.2 }}
                  viewport={{ once: true }}
                >
                  <span className="mt-0.5">{item.icon}</span>
                  <span className="text-sm text-gray-400">{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Footer Links */}
          {footerLinks.map((column, colIndex) => (
            <motion.div
              key={column.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (colIndex + 1) }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-white font-semibold text-lg">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * linkIndex + 0.3 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-white text-sm transition-colors flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-600 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-sm text-gray-500 text-center md:text-left mb-4 md:mb-0">
            © {currentYear} HaliSahaBul. Tüm hakları saklıdır.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-white transition-colors">
              Gizlilik Politikası
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-white transition-colors">
              Kullanım Şartları
            </Link>
            <Link to="/cookies" className="text-sm text-gray-500 hover:text-white transition-colors">
              Çerez Politikası
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
