import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import GizlilikPage from './pages/GizlilikPage';
import SSSPage from './pages/SSSPage';
import AccountPage from './pages/AccountPage';

// Styles
import './index.css';

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
        <Route index element={
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
        
        <Route path="/giris" element={
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
        
        <Route path="/kayit" element={
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
        
        <Route path="/iletisim" element={
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
        
        <Route path="/yardim-merkezi" element={
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
        
        <Route path="/sozlesmeler-ve-kurallar" element={
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
        
        <Route path="/gizlilik-politikasi" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="min-h-screen flex flex-col"
          >
            <GizlilikPage />
          </motion.div>
        } />
        
        <Route path="/sss" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="min-h-screen flex flex-col"
          >
            <SSSPage />
          </motion.div>
        } />
        
        <Route path="/hesabim" element={
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
        
        {/* 404 - Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

// 404 Page
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sayfa Bulunamadı</h2>
      <p className="text-gray-600 mb-8">
        Aradığınız sayfa taşınmış veya kaldırılmış olabilir.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Anasayfaya Dön
      </a>
    </div>
  </div>
);

// Main App component
const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16"> 
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;