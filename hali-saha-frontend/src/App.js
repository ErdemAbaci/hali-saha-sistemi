import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HaliSahaDetail from './pages/HaliSahaDetail'; // Düzeltildi: HaliSahaDetails -> HaliSahaDetail
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import 'react-datepicker/dist/react-datepicker.css'
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Opsiyonel: Global Header veya Navbar */}
        {/* <Header /> */}
        <Switch> {/* Routes yerine Switch kullan */}
          <Route path="/" exact component={HomePage} /> {/* exact ve component prop'u */}
          <Route path="/halisaha/:id" component={HaliSahaDetail} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignupPage} />
          <Route component={() => <h1>404 - Sayfa Bulunamadı</h1>} /> {/* Hata sayfası */}
        </Switch>
        {/* Opsiyonel: Global Footer */}
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;