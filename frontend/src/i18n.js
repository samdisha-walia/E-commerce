// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      cart: "Cart",
      login: "Login",
      logout: "Logout",
      settings: "Settings",
      language: "Language",
      currency: "Currency",
      darkMode: "Dark Mode",
      exploreProducts: "Explore Products",
      searchPlaceholder: "Search products...",
      allCategories: "All Categories",
      clothing: "Clothing",
      electronics: "Electronics",
      footwear: "Footwear",
      addToCart: "Add to Cart",
      orders: "Previous Orders",
      support: "Customer Support",
      profile: "User Profile"
    }
  },
  hi: {
    translation: {
      welcome: "स्वागत है",
      cart: "कार्ट",
      login: "लॉगिन",
      logout: "लॉगआउट",
      settings: "सेटिंग्स",
      language: "भाषा",
      currency: "मुद्रा",
      darkMode: "डार्क मोड",
      exploreProducts: "उत्पादों का अन्वेषण करें",
      searchPlaceholder: "उत्पाद खोजें...",
      allCategories: "सभी श्रेणियाँ",
      clothing: "कपड़े",
      electronics: "इलेक्ट्रॉनिक्स",
      footwear: "जूते",
      addToCart: "कार्ट में जोड़ें",
      orders: "पिछले ऑर्डर",
      support: "ग्राहक सहायता",
      profile: "उपयोगकर्ता प्रोफ़ाइल"
    }
  },
  fr: {
    translation: {
      welcome: "Bienvenue",
      cart: "Panier",
      login: "Connexion",
      logout: "Déconnexion",
      settings: "Paramètres",
      language: "Langue",
      currency: "Devise",
      darkMode: "Mode Sombre",
      exploreProducts: "Explorer les produits",
      searchPlaceholder: "Rechercher des produits...",
      allCategories: "Toutes les catégories",
      clothing: "Vêtements",
      electronics: "Électronique",
      footwear: "Chaussures",
      addToCart: "Ajouter au panier",
      orders: "Commandes précédentes",
      support: "Support client",
      profile: "Profil utilisateur"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
