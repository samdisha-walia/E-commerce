import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  const total = cartItems.reduce((a, i) => a + i.price * i.quantity, 0);
  const freeShipThreshold = 2000;
  const remaining = freeShipThreshold - total;
  const navigate = useNavigate();

  return (
    <div className="cart-container">
      <motion.h2 
        className="cart-heading"
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🛒 Your Cart
      </motion.h2>

      {cartItems.length === 0 ? (
        <motion.p 
          className="empty-cart"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Your cart is empty.
        </motion.p>
      ) : (
        <div className="cart-grid">
          {/* 🧾 Cart Items */}
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id || index}
                className="cart-item"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>₹{item.price.toFixed(2)}</p>

                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>

                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>

                <div className="item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
              </motion.div>
            ))}
          </div>

          {/* 💳 Summary */}
          <motion.div
            className="cart-summary"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="summary-box glass">
              <h3>Order Summary</h3>
              <p>Subtotal: ₹{total.toFixed(2)}</p>
              {remaining > 0 ? (
                <p className="promo-text">
                  Add ₹{remaining.toFixed(2)} more to get free shipping!
                </p>
              ) : (
                <p className="promo-text success">You’ve unlocked free shipping! 🎉</p>
              )}

              <motion.button 
                className="checkout-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </motion.button>

              <button className="continue-btn" onClick={() => navigate('/products')}>
                ← Continue Shopping
              </button>

              <p className="support-text">
                Questions? <a href="/support">Chat with us</a>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
