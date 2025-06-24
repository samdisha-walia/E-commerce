import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  const total = cartItems.reduce((a, i) => a + i.price * i.quantity, 0);
  const freeShipThreshold = 2000;
  const remaining = freeShipThreshold - total;
  const navigate = useNavigate();

  return (
    <div className="cart-container">
      <h2 className="cart-heading">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div className="cart-grid">
          {/* 🧾 Cart Items */}
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
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
              </div>
            ))}
          </div>

          {/* 💳 Summary */}
          <div className="cart-summary">
            <div className="summary-box">
              <h3>Order Summary</h3>
              <p>Subtotal: ₹{total.toFixed(2)}</p>
              {remaining > 0 ? (
                <p className="promo-text">
                  Add ₹{remaining.toFixed(2)} more to get free shipping!
                </p>
              ) : (
                <p className="promo-text success">You’ve unlocked free shipping! 🎉</p>
              )}

            <button className="checkout-btn" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
            </button>              
            <button className="continue-btn" onClick={() => navigate('/products')}>
                ← Continue Shopping
              </button>

             
              <p className="support-text">
                Questions? <a href="/support">Chat with us</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
