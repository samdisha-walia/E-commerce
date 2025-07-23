import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import './i18n';

import { CartProvider } from './context/CartContext';
import { CustomThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <CustomThemeProvider>
        <App />
      </CustomThemeProvider>
    </CartProvider>
  </React.StrictMode>
);
