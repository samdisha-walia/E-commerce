import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import './i18n';
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";


import { CartProvider } from './context/CartContext';
import {  ThemeModeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeModeProvider>
    <CartProvider>
      
        <App />
      
    </CartProvider>
    </ThemeModeProvider>
  </React.StrictMode>
);
