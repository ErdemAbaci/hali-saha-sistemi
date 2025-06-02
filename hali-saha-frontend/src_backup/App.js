import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Components/layout/Navbar';
import Footer from './Components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import HaliSahaDetail from './pages/HaliSahaDetail';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SahalarPage from './pages/SahalarPage';
import NasilCalisirPage from './pages/NasilCalisirPage';
import ContactPage from './pages/ContactPage';
import HelpCenterPage from './pages/HelpCenterPage';
import TermsPage from './pages/TermsPage';
import AccountPage from './pages/AccountPage';

// Styles
import './index.css'; // Using index.css instead of App.css for Tailwind

// Animation variants for page transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  out: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

// Wrapper component for page transitions
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="min-h-screen flex flex-col"
          >
            <HomePage />
          </motion.div>
        } />
        
        <Route path="/halisaha/:id" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="min-h-screen flex flex-col"
          >
            <HaliSahaDetail />
          </motion.div>
        } />
        
        <Route path="/login" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="min-h-screen flex flex-col"
          >
            <LoginPage />
          </motion.div>
        } />
        
        <Route path="/signup" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="min-h-screen flex flex-col"
          >
            <SignupPage />
          </motion.div>
        } />
        
        <Route path="/sahalar" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="min-h-screen flex flex-col"
          >
            <SahalarPage />
          </motion.div>
        } />
        
        <Route path="/nasil-calisir" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="min-h-screen flex flex-col"
          >
            <NasilCalisirPage />
          </motion.div>
        } />
        
        <Route path="/contact" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="min-h-screen flex flex-col"
          >
            <ContactPage />
          </motion.div>
        } />
        
        <Route path="/help" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="min-h-screen flex flex-col"
          >
            <HelpCenterPage />
          </motion.div>
        } />
        
        <Route path="/terms" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="min-h-screen flex flex-col"
          >
            <TermsPage />
          </motion.div>
        } />
        
        <Route path="/account" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="min-h-screen flex flex-col"
          >
            <AccountPage />
          </motion.div>
        } />
        
        <Route path="*" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="min-h-screen flex flex-col items-center justify-center bg-gray-50"
          >
            <div className="text-center p-8 max-w-2xl mx-auto">
              <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">Sayfa Bulunamadı</h2>
              <p className="text-gray-600 mb-8">
                Aradığınız sayfa taşınmış veya kaldırılmış olabilir. Anasayfaya dönmek için aşağıdaki butonu kullanabilirsiniz.
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Anasayfaya Dön
              </Link>
            </div>
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
};

// Main App component
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Navigation */}
        <Navbar />
        
        {/* Main Content */}
        <main className="flex-grow pt-16">
          <AnimatedRoutes />
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;