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
import CerezPolitikasiPage from './pages/CerezPolitikasiPage';
import AccountPage from './pages/AccountPage';
import AdminPage from './pages/AdminPage';
import OperatorPage from './pages/OperatorPage';
import NotFoundPage from './pages/NotFoundPage';
import LineupBuilderPage from './pages/LineupBuilderPage';
import PrivateRoute from './Components/common/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import PaymentPage from './pages/PaymentPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SubPaymentPage from './pages/SubPaymentPage';
import MySubscriptionsPage from './pages/MySubscriptionsPage';
import UseSubscriptionRightPage from './pages/UseSubscriptionRightPage';

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
const AnimatedRoutesWrapper = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route index element={<AnimatedPage><HomePage /></AnimatedPage>} />
        <Route path="/halisaha/:id" element={<AnimatedPage><HaliSahaDetail /></AnimatedPage>} />
        <Route path="/giris" element={<AnimatedPage><LoginPage /></AnimatedPage>} />
        <Route path="/kayit" element={<AnimatedPage><SignupPage /></AnimatedPage>} />
        <Route path="/sahalar" element={<AnimatedPage><SahalarPage /></AnimatedPage>} />
        <Route path="/nasil-calisir" element={<AnimatedPage><NasilCalisirPage /></AnimatedPage>} />
        <Route path="/iletisim" element={<AnimatedPage><ContactPage /></AnimatedPage>} />
        <Route path="/yardim-merkezi" element={<AnimatedPage><HelpCenterPage /></AnimatedPage>} />
        <Route path="/sozlesmeler-ve-kurallar" element={<AnimatedPage><TermsPage /></AnimatedPage>} />
        <Route path="/gizlilik-politikasi" element={<AnimatedPage><GizlilikPage /></AnimatedPage>} />
        <Route path="/sss" element={<AnimatedPage><SSSPage /></AnimatedPage>} />
        <Route path="/cerez-politikasi" element={<AnimatedPage><CerezPolitikasiPage /></AnimatedPage>} />
        <Route path="/lineup-builder" element={<AnimatedPage><LineupBuilderPage /></AnimatedPage>} />
        <Route path="/abonelik" element={<AnimatedPage><SubscriptionPage /></AnimatedPage>} />
        <Route path="/odeme" element={
          <PrivateRoute>
            <PaymentPage />
          </PrivateRoute>
        } />
        <Route path="/abonelik-odeme" element={<PrivateRoute allowedRoles={['customer', 'operator', 'admin']}><AnimatedPage><SubPaymentPage /></AnimatedPage></PrivateRoute>} />
        <Route path="/aboneliklerim" element={<PrivateRoute allowedRoles={['customer', 'operator', 'admin']}><AnimatedPage><MySubscriptionsPage /></AnimatedPage></PrivateRoute>} />
        <Route path="/abonelik-hakki-kullan" element={<PrivateRoute allowedRoles={['customer', 'operator', 'admin']}><AnimatedPage><UseSubscriptionRightPage /></AnimatedPage></PrivateRoute>} />
        {/* Protected Routes */}
        <Route path="/profil" element={<PrivateRoute allowedRoles={['customer', 'operator', 'admin']}><AnimatedPage><AccountPage /></AnimatedPage></PrivateRoute>} />
        <Route path="/rezervasyonlarim" element={<PrivateRoute allowedRoles={['customer', 'operator', 'admin']}><AnimatedPage><RezervasyonlarimPage /></AnimatedPage></PrivateRoute>} />
        <Route path="/hesabim" element={<PrivateRoute allowedRoles={['customer', 'operator', 'admin']}><AnimatedPage><AccountPage /></AnimatedPage></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']}><AnimatedPage><AdminPage /></AnimatedPage></PrivateRoute>} />
        <Route path="/operator" element={<PrivateRoute allowedRoles={['admin', 'operator']}><AnimatedPage><OperatorPage /></AnimatedPage></PrivateRoute>} />

        {/* Not Found Route */}
        <Route path="*" element={<AnimatedPage><NotFoundPage /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
};

// Wrapper component for page transitions, App.js'deki AnimatedRoutes yerine kullanılacak
const AnimatedPage = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    className="min-h-screen flex flex-col"
  >
    {children}
  </motion.div>
);

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow pt-16"> 
            <AnimatedRoutesWrapper />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;