//src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
/*import Home from './pages/Home';*/
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import ProductList from './pages/ProductList';
import CartPage from './pages/CartPage';
import ForgotPassword from './pages/ForgotPassword'; 
import ResetPassword from './pages/ResetPassword';
import CheckoutPage from './pages/CheckoutPage';
import OrderPage from './pages/OrderPage';
import ThankYouPage from './pages/ThankYouPage';
import ProfilePage from './pages/ProfilePage';
import CustomerSupport from './pages/CustomerSupport';
import SettingsPage from './pages/SettingsPage';
import AdminDashboard from './pages/AdminDashboard';
import ChatBot from './components/ChatBot';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* 🔒 Protected route */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ProductList />
            </PrivateRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* 🔒 Protected routes */}
        
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <ProductList />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrderPage />
            </PrivateRoute>
          }
        />
        <Route
        path="/thank-you"
        element={
          <PrivateRoute>
            <ThankYouPage />
          </PrivateRoute>
        }
      />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/support"
          element={
            <PrivateRoute>
              <CustomerSupport />
            </PrivateRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute requireAdmin>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
      <ChatBot />
    </Router>
  );
}

export default App;
