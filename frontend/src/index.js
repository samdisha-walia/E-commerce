import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CartProvider } from './context/CartContext';
import { CustomThemeProvider } from './context/ThemeContext';
import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <CustomThemeProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </CustomThemeProvider>
  </React.StrictMode>
);
