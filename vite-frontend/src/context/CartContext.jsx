// src/context/CartContext.jsx
import React, { createContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [coupon, setCoupon] = useState(() => {
    const saved = localStorage.getItem('coupon');
    return saved ? JSON.parse(saved) : null;
  });
  const [discountAmount, setDiscountAmount] = useState(() => {
    const saved = localStorage.getItem('discountAmount');
    return saved ? Number(saved) : 0;
  });
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const apiBaseUrl = useMemo(() => {
    const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
    return base || 'http://localhost:5000';
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('coupon', JSON.stringify(coupon));
      localStorage.setItem('discountAmount', discountAmount.toString());
    } else {
      localStorage.removeItem('coupon');
      localStorage.removeItem('discountAmount');
    }
  }, [coupon, discountAmount]);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const payableTotal = useMemo(
    () => Math.max(subtotal - discountAmount, 0),
    [subtotal, discountAmount]
  );

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, qty) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearCoupon = () => {
    setCoupon(null);
    setDiscountAmount(0);
  };

  const clearCart = () => {
    setCartItems([]);
    clearCoupon();
  };

  useEffect(() => {
    if (subtotal === 0 && discountAmount > 0) {
      clearCoupon();
    }
  }, [subtotal]);

  const applyCoupon = async (code) => {
    if (!code) {
      throw new Error('Coupon code is required.');
    }

    setIsApplyingCoupon(true);
    try {
      const { data } = await axios.post(`${apiBaseUrl}/api/coupons/apply`, {
        code,
        cartTotal: subtotal,
      });

      setCoupon(data.coupon);
      setDiscountAmount(data.discountAmount);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to apply coupon.';
      throw new Error(message);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    clearCoupon();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        payableTotal,
        coupon,
        discountAmount,
        applyCoupon,
        removeCoupon,
        isApplyingCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
