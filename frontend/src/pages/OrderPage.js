import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import MainLayout from '../components/MainLayout';
const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem('orders')) || {};
    const userOrders = allOrders[user?.email] || [];
    setOrders(userOrders.reverse()); // show latest first
  }, [user]);

  return (
    <MainLayout>
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        📦 Your Previous Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography>No previous orders found.</Typography>
      ) : (
        orders.map((order, index) => (
          <Paper key={index} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography fontWeight={500}>Order #{orders.length - index}</Typography>
            <Typography variant="caption" color="textSecondary">
              {new Date(order.date).toLocaleString()}
            </Typography>
            <Divider sx={{ my: 1 }} />
            {order.items.map((item, i) => (
              <Typography key={i}>
                {item.name} × {item.quantity} — ₹{item.price * item.quantity}
              </Typography>
            ))}
            <Divider sx={{ my: 1 }} />
            <Typography fontWeight={600}>Total: ₹{order.total.toFixed(2)}</Typography>
          </Paper>
        ))
      )}
    </Box>
    </MainLayout>
  );
};

export default OrderPage;
