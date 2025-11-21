import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./CartPage.css";

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotal,
    payableTotal,
    coupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
    isApplyingCoupon,
  } = useContext(CartContext);
  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const freeShipThreshold = 2000;
  const remaining = Math.max(freeShipThreshold - subtotal, 0);
  const shippingFee = remaining > 0 && subtotal > 0 ? 49 : 0;
  const navigate = useNavigate();

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      setCouponMessage("Enter a coupon code.");
      return;
    }
    try {
      const data = await applyCoupon(couponInput.trim());
      setCouponMessage(`Coupon applied! Saved ₹${data.discountAmount.toFixed(2)}.`);
      setCouponInput("");
    } catch (error) {
      setCouponMessage(error.message);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponMessage("Coupon removed.");
  };

  return (
    <div className="cart-container">
      <motion.h2
        className="cart-heading"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🛒 Your Bag
      </motion.h2>

      {cartItems.length === 0 ? (
        <motion.p className="empty-cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Your cart is empty — start shopping!
        </motion.p>
      ) : (
        <div className="cart-layout">
          {/* 🧾 Left side - Items */}
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id || index}
                className="cart-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="cart-img-box">
                  <img src={item.image} alt={item.name} className="cart-img" />
                </div>

                <div className="cart-details">
                  <h4 className="cart-name">{item.name}</h4>
                  <p className="cart-price">
                    ₹{item.price.toFixed(2)}{" "}
                    {item.mrp && (
                      <span className="cart-mrp">₹{item.mrp}</span>
                    )}
                  </p>

                  <div className="quantity-box">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>

                <div className="cart-total">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </motion.div>
            ))}
          </div>

          {/* 💳 Right side - Summary */}
          <motion.div
            className="cart-summary"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="summary-box glass">
              <h3 className="summary-title">Order Summary</h3>

              {/* 🛍️ Products List with MRP */}
              <div className="summary-products">
                {cartItems.map((item, index) => (
                  <div key={index} className="summary-product-item">
                    <span className="summary-product-name">{item.name}</span>
                    <span className="summary-product-prices">
                      {item.mrp && (
                        <span className="summary-mrp">₹{item.mrp}</span>
                      )}
                      <span className="summary-price">
                        ₹{item.price * item.quantity}
                      </span>
                    </span>
                  </div>
                ))}
              </div>

              <hr />

              <div className="summary-line">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {coupon && (
                <div className="summary-line discount-line">
                  <span>{coupon.code} Applied</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-line">
                <span>Shipping</span>
                <span>{shippingFee > 0 ? `₹${shippingFee}` : "Free"}</span>
              </div>
              <hr />
              <div className="summary-total-line">
                <span>Total</span>
                <span>
                  ₹{(payableTotal + shippingFee).toFixed(2)}
                </span>
              </div>

              <div className="coupon-box">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                />
                {coupon ? (
                  <button className="coupon-remove" onClick={handleRemoveCoupon}>
                    Remove
                  </button>
                ) : (
                  <button
                    className="coupon-apply"
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon}
                  >
                    {isApplyingCoupon ? "Applying..." : "Apply"}
                  </button>
                )}
              </div>
              {couponMessage && <p className="coupon-message">{couponMessage}</p>}

              {remaining > 0 ? (
                <p className="promo-text">
                  Add ₹{remaining.toFixed(2)} more for <strong>Free Shipping</strong>.
                </p>
              ) : (
                <p className="promo-text success">🎉 You’ve unlocked free shipping!</p>
              )}

              <motion.button
                className="checkout-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </motion.button>

              <button className="continue-btn" onClick={() => navigate("/products")}>
                ← Continue Shopping
              </button>

              <p className="secure-text">SSL Secured • Encrypted Checkout</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
