import React, { useContext, useState } from 'react';
import {
  Box, TextField, Typography, Button, Paper, Grid, Alert, Radio, RadioGroup, FormControlLabel, FormLabel
} from '@mui/material';
import { CartContext } from '../context/CartContext';
import axios from 'axios';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [submitted, setSubmitted] = useState(false);
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMode, setPaymentMode] = useState('pod'); // Default to Pay on Delivery

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

    const user = JSON.parse(localStorage.getItem('user'));


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

        clearCart();

         // Send receipt
        await axios.post('http://localhost:5000/api/orders/send-receipt', {
            order: newOrder,
            user
        });

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
    <Box component={Paper} sx={{ maxWidth: 700, mx: 'auto', mt: 6, p: 4, borderRadius: 4 }}>
      <Typography variant="h5" mb={3} textAlign="center" fontWeight={600}>
        🧳 Checkout
      </Typography>

      {submitted && <Alert severity="success" sx={{ mb: 2 }}>Order placed successfully! Redirecting...</Alert>}

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

        <Typography mt={3} fontWeight={500}>
          💰 Total: ₹{total.toFixed(2)}
        </Typography>

        {paymentMode === 'pod' ? (
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, py: 1.4, background: 'linear-gradient(to right, #00b09b, #96c93d)', fontWeight: 600 }}
          >
            Place Order (POD)
          </Button>
        ) : (
          <Button
            variant="contained"
            fullWidth
            onClick={handleRazorpay}
            sx={{ mt: 3, py: 1.4, background: 'linear-gradient(to right, #1c92d2, #f2fcfe)', fontWeight: 600 }}
          >
            Pay at Next Step (Razorpay)
          </Button>
        )}
      </form>
    </Box>
  );
};

export default CheckoutPage;
