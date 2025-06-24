import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import {
  Box, Typography, Paper, Divider, Button
} from '@mui/material';

const ThankYouPage = () => {
  const [order, setOrder] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem('orders')) || {};
    const userOrders = allOrders[user?.email] || [];
    const latestOrder = userOrders[userOrders.length - 1];
    setOrder(latestOrder);
  }, []);

  if (!order) {
    return <Typography mt={10} textAlign="center">No recent order found.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 6, p: 3 }}>
      <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          🎉 Thank You for Your Order!
        </Typography>
        <Typography color="text.secondary" mb={3}>
          We've received your order placed on{' '}
          {new Date(order.date).toLocaleString()}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {order.items.map((item, i) => (
          <Typography key={i}>
            {item.name} × {item.quantity} — ₹{item.price * item.quantity}
          </Typography>
        ))}

        <Divider sx={{ my: 2 }} />

        <Typography fontWeight={600} fontSize="1.1rem">
          Total Paid: ₹{order.total.toFixed(2)}
        </Typography>
        <Button
            variant="contained"
            onClick={() => {
                console.log('Clicked: Navigating to /products');
                navigate('/products');
                }}

            sx={{
                mt: 3,
                background: 'linear-gradient(135deg,rgb(29, 31, 151),rgb(147, 166, 249))',
                color: 'white',
                fontWeight: 600,
                px: 4,
                py: 1.2,
                borderRadius: 2,
                textTransform: 'none'
            }}
            >
            🛍️ Continue Shopping
        </Button>
        </Paper>
      

    </Box>
  );
};

export default ThankYouPage;
