import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleContinue = () => {
    // Set flag for welcome message
    localStorage.setItem('justLoggedIn', 'true');
    navigate('/products');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Welcome, {user?.name || 'User'}! 🛒</h2>
      <p>You are logged in with {user?.email}</p>
      <button onClick={handleContinue} style={{ marginRight: '10px' }}>Continue to Shop</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
