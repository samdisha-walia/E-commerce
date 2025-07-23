//src/components/Header.jsx

import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const [showProfile, setShowProfile] = useState(false);
  const [showMiniCart, setShowMiniCart] = useState(false);

  const user = { name: 'John Doe', email: 'john@example.com' }; // pull real data

  return (
    <header className="site-header">
      <div className="left-icon">
        <FaUserCircle size={28} onClick={() => setShowProfile(!showProfile)} />
        {showProfile && (
          <div className="profile-dropdown">
            <p><strong>{user.name}</strong></p>
            <p>{user.email}</p>
            <button onClick={() => {/* logout */}}>Logout</button>
          </div>
        )}
      </div>

      <div className="right-icon">
        <FaShoppingCart size={26} onClick={() => setShowMiniCart(true)} />
        {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
      </div>

      {showMiniCart && (
        <div className="mini-cart-drawer">
          <button className="close-btn" onClick={() => setShowMiniCart(false)}>×</button>
          {cartItems.length === 0 ? <p>No items.</p> : (
            <>
              {cartItems.map(i => (
                <div className="mini-cart-item" key={i.id}>
                  <img src={i.image} alt={i.name} width="40" />
                  <div>
                    <p>{i.name}</p>
                    <p>₹{i.price} × {i.quantity}</p>
                  </div>
                </div>
              ))}
              <p className="subtotal">
                Subtotal: ₹{cartItems.reduce((a,i)=>a+i.price*i.quantity,0).toFixed(2)}
              </p>
              <button onClick={() => { /* navigate to /cart */ }}>View Cart</button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
