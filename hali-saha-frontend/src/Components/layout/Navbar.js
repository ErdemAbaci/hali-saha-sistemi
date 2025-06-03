import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Calendar, Home, Info, HelpCircle, Phone } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Check if user is logged in and sync across tabs
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('userToken');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          return true;
        } else {
          setUser(null);
          return false;
        }
      } catch (e) {
        console.error('Error checking auth:', e);
        setUser(null);
        return false;
      }
    };

    // Initial check
    checkAuth();
    
    // Set up storage event listener for cross-tab sync
    const handleStorageChange = (e) => {
      if (e.key === 'userToken' || e.key === 'user' || e.key === null) {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    setUser(null);
    setIsProfileOpen(false);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('auth'));
    navigate('/');
  };

  const navLinks = [
    { name: 'Ana Sayfa', path: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Sahalar', path: '/sahalar', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Nasıl Çalışır?', path: '/nasil-calisir', icon: <Info className="w-5 h-5" /> },
    { name: 'Yardım', path: '/yardim-merkezi', icon: <HelpCircle className="w-5 h-5" /> },
    { name: 'İletişim', path: '/iletisim', icon: <Phone className="w-5 h-5" /> },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur-sm py-2 md:py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
                Forma<span className="font-extrabold">Golü</span>
              </span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors ${
                      location.pathname === link.path
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 bg-primary-50 hover:bg-primary-100 rounded-full px-3 py-1.5 transition-colors border border-primary-100 shadow-sm"
                  aria-label="Hesap menüsü"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                >
                  <div className="h-8 w-8 rounded-full bg-primary-100 border-2 border-white shadow-sm flex items-center justify-center text-primary-600">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 leading-tight">
                      {user.name?.split(' ')[0] || 'Kullanıcı'}
                    </p>
                    <p className="text-xs text-primary-600 font-medium">
                      Hesabım
                    </p>
                  </div>
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                      tabIndex="-1"
                    >
                      <div className="py-1" role="none">
                        <div className="px-4 py-2.5 border-b border-gray-100">
                          <p className="text-sm text-gray-900 font-medium">{user.name || 'Kullanıcı'}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          to="/profil"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                          role="menuitem"
                          tabIndex="-1"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            Profilim
                          </div>
                        </Link>
                        <Link
                          to="/rezervasyonlarim"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                          role="menuitem"
                          tabIndex="-1"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            Rezervasyonlarım
                          </div>
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center"
                          role="menuitem"
                          tabIndex="-1"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Çıkış Yap
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/giris"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/kayit"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-green-600 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                >
                  Ücretsiz Kayıt Ol
                </Link>
              </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-primary-50 rounded-full px-3 py-1.5 border border-primary-100 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-primary-100 border-2 border-white flex items-center justify-center text-primary-600">
                  <User className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900 leading-tight">
                    {user.name?.split(' ')[0] || 'Kullanıcı'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>

    {/* Mobile menu */}
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-white shadow-lg overflow-y-auto"
        >
          <div className="px-2 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3 text-base font-medium rounded-lg mx-2 ${
                  location.pathname === link.path
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">{link.icon}</span>
                {link.name}
              </Link>
            ))}

            {user ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                      <User className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user.name || 'Kullanıcı'}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to="/profil"
                    onClick={() => {
                      setIsOpen(false);
                      setIsProfileOpen(false);
                    }}
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    Profilim
                  </Link>
                  <Link
                    to="/rezervasyonlarim"
                    onClick={() => {
                      setIsOpen(false);
                      setIsProfileOpen(false);
                    }}
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    Rezervasyonlarım
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-800"
                  >
                    Çıkış Yap
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="space-y-1">
                  <Link
                    to="/giris"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    to="/kayit"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-base font-medium text-primary-600 hover:bg-primary-50"
                  >
                    Ücretsiz Kayıt Ol
                  </Link>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </nav>
  );
};

export default Navbar;
