//src/pages/CheckoutPage.jsx

import React, { useContext, useState } from 'react';
import {
  Box, TextField, Typography, Button, Paper, Grid,
  Alert, Radio, RadioGroup, FormControlLabel, FormLabel
} from '@mui/material';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import LocalMallIcon from '@mui/icons-material/LocalMall';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [submitted, setSubmitted] = useState(false);
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMode, setPaymentMode] = useState('pod');

  const user = JSON.parse(localStorage.getItem('user'));

  const handlePOD = async (e) => {
    e.preventDefault();
    if (!user?.email) return;

    const newOrder = {
      items: cartItems,
      total,
      date: new Date().toISOString(),
      address: `${name}, ${address}, ${city} - ${postalCode}`,
      paymentStatus: 'Pending',
    };

    const allOrders = JSON.parse(localStorage.getItem('orders')) || {};
    const userOrders = allOrders[user.email] || [];
    userOrders.push(newOrder);
    allOrders[user.email] = userOrders;
    localStorage.setItem('orders', JSON.stringify(allOrders));
    

  try {
  // ✅ 1. Save order in MongoDB
  const token = user?.token;
  await axios.post('http://localhost:5000/api/orders', {
    order: {
    items: cartItems,
    total,
    address: `${name}, ${address}, ${city} - ${postalCode}`,
    paymentStatus: paymentMode === 'pod' ? 'Pending' : 'Paid',}
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // ✅ 2. Send email receipt
  await axios.post('http://localhost:5000/api/orders/send-receipt', {
    order: newOrder,
    user
  });
} catch (error) {
  console.error("❌ Error saving order or sending receipt:", error);
}



    clearCart();
    setSubmitted(true);
    setTimeout(() => {
      window.location.href = '/thank-you';
    }, 2000);
  };

  const createRazorpayOrder = async (amount) => {
    const { data } = await axios.post('http://localhost:5000/api/payment/create-order', { amount });
    return data;
  };

  const handleRazorpay = async () => {
    const orderData = await createRazorpayOrder(total);

    const options = {
      key: 'rzp_test_R4Vd5cqEJsHKbd',
      amount: orderData.amount,
      currency: 'INR',
      name: 'Shop-Top',
      description: 'Test Transaction',
      order_id: orderData.id,
      handler: async function (response) {
        alert("Payment Successful! ID: " + response.razorpay_payment_id);

        const newOrder = {
          items: cartItems,
          total,
          date: new Date().toISOString(),
          address: `${name}, ${address}, ${city} - ${postalCode}`,
          paymentStatus: 'Paid',
        };

        const allOrders = JSON.parse(localStorage.getItem('orders')) || {};
        const userOrders = allOrders[user.email] || [];
        userOrders.push(newOrder);
        allOrders[user.email] = userOrders;
        localStorage.setItem('orders', JSON.stringify(allOrders));
        localStorage.setItem('lastOrder', JSON.stringify(newOrder));

        await axios.post('http://localhost:5000/api/orders/send-receipt', {
          order: newOrder,
          user
        });

        clearCart();
        setSubmitted(true);
        setTimeout(() => {
          window.location.href = '/thank-you';
        }, 2000);
      },
      prefill: {
        name: user?.name,
        email: user?.email
      },
      theme: {
        color: '#3399cc'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box component={Paper} elevation={4} sx={{
        maxWidth: 700,
        mx: 'auto',
        mt: 6,
        p: { xs: 3, sm: 4 },
        borderRadius: 4,
        background: 'linear-gradient(to right, #ffffff, #f9f9f9)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
      }}>
        <Typography variant="h5" mb={3} textAlign="center" fontWeight={700}>
          <LocalMallIcon sx={{ mr: 1, color: '#333' }} />
          Checkout
        </Typography>

        {submitted && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Order placed successfully! Redirecting...
          </Alert>
        )}

        <form onSubmit={handlePOD}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Full Name" fullWidth required value={name} onChange={(e) => setName(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Shipping Address" fullWidth required value={address} onChange={(e) => setAddress(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="City" fullWidth required value={city} onChange={(e) => setCity(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Postal Code" fullWidth required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
            </Grid>

            <Grid item xs={12}>
              <FormLabel component="legend">Payment Mode</FormLabel>
              <RadioGroup
                row
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <FormControlLabel value="pod" control={<Radio />} label="Pay on Delivery" />
                <FormControlLabel value="razorpay" control={<Radio />} label="Pay with Razorpay" />
              </RadioGroup>
            </Grid>
          </Grid>

          <Typography mt={3} fontWeight={500} fontSize="1.2rem">
            💰 Total: ₹{total.toFixed(2)}
          </Typography>

          {paymentMode === 'pod' ? (
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.4,
                background: 'linear-gradient(to right, #00b09b, #96c93d)',
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              Place Order (Pay on Delivery)
            </Button>
          ) : (
            <Button
              variant="contained"
              fullWidth
              onClick={handleRazorpay}
              sx={{
                mt: 3,
                py: 1.4,
                background: 'linear-gradient(to right, #1c92d2, #f2fcfe)',
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              Pay with Razorpay
            </Button>
          )}
        </form>
      </Box>
    </motion.div>
  );
};

export default CheckoutPage;
