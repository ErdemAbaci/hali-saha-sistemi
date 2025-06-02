import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18 için 'client' kullanılıyor
import './index.css'; // Global CSS dosyanız
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

