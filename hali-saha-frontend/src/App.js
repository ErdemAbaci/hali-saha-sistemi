import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HaliSahaDetail from './pages/HaliSahaDetail'; // Düzeltildi: HaliSahaDetails -> HaliSahaDetail
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SahalarPage from './pages/SahalarPage';
import NasilCalisirPage from './pages/NasilCalisirPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Opsiyonel: Global Header veya Navbar */}
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/halisaha/:id" element={<HaliSahaDetail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/sahalar" element={<SahalarPage />} />
          <Route path="/nasil-calisir" element={<NasilCalisirPage />} />
          <Route path="*" element={<h1>404 - Sayfa Bulunamadı</h1>} />
        </Routes>
        {/* Opsiyonel: Global Footer */}
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;