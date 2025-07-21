import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <App />
    <Toaster position="top-right" reverseOrder={false} />
  </HelmetProvider>
);
