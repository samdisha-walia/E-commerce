import React, { useContext, useState } from 'react';
import {
  Box, TextField, Typography, Button, Paper, Grid, Alert
} from '@mui/material';
import { CartContext } from '../context/CartContext';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [submitted, setSubmitted] = useState(false);
  


  const orderData = {
  items: cartItems,
  total,
  date: new Date().toISOString(),
    };

    localStorage.setItem('lastOrder', JSON.stringify(orderData));


  const handleSubmit = (e) => {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user?.email) return;

  const newOrder = {
    items: cartItems,
    total,
    date: new Date().toISOString(),
  };
  // Fetch existing orders
  const allOrders = JSON.parse(localStorage.getItem('orders')) || {};
 
  

  // Add this order under user's email
  const userOrders = allOrders[user.email] || [];
  userOrders.push(newOrder);
  allOrders[user.email] = userOrders;

  // Save back to localStorage
  localStorage.setItem('orders', JSON.stringify(allOrders));

    // Clear cart
    clearCart();

  // Confirmation
  setSubmitted(true);
  setTimeout(() => {
    window.location.href = '/thank-you';
  }, 2000);
};
  return (
    <Box component={Paper} sx={{ maxWidth: 700, mx: 'auto', mt: 6, p: 4, borderRadius: 4 }}>
      <Typography variant="h5" mb={3} textAlign="center" fontWeight={600}>
        🧾 Checkout
      </Typography>

      {submitted && <Alert severity="success" sx={{ mb: 2 }}>Payment successful! Redirecting to home...</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Full Name" fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Shipping Address" fullWidth required />
          </Grid>
          <Grid item xs={6}>
            <TextField label="City" fullWidth required />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Postal Code" fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Card Number" fullWidth required inputProps={{ maxLength: 16 }} />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Expiry Date (MM/YY)" fullWidth required />
          </Grid>
          <Grid item xs={6}>
            <TextField label="CVV" fullWidth required inputProps={{ maxLength: 3 }} />
          </Grid>
        </Grid>

        <Typography mt={3} fontWeight={500}>
          💰 Total: ₹{total.toFixed(2)}
        </Typography>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            py: 1.4,
            background: 'linear-gradient(135deg, #00b09b, #96c93d)',
            fontWeight: 600,
            fontSize: '1.05rem'
          }}
        >
          Pay & Place Order
        </Button>
      </form>
    </Box>
  );
};

export default CheckoutPage;
