import React from 'react';
import { Navigate } from 'react-router-dom';

const getRoleFromToken = (token) => {
  try {
    const [, payload = ''] = token.split('.');
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded.role;
  } catch (error) {
    return null;
  }
};

const PrivateRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin) {
    let roleFromStorage = null;
    try {
      const parsed = user ? JSON.parse(user) : null;
      roleFromStorage = parsed?.role || null;
    } catch (error) {
      roleFromStorage = null;
    }

    const role = roleFromStorage || getRoleFromToken(token);
    if (role !== 'admin') {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
