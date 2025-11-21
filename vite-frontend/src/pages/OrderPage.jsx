//src/pages/OrderPage.jsx

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import MainLayout from "../components/MainLayout";
import { Box, Grid, Paper, Typography, Chip, Divider, CircularProgress } from "@mui/material";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const apiBaseUrl = useMemo(() => {
    const base = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
    return base || "http://localhost:5000";
  }, []);

  const formatCurrency = (value = 0) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const resolvePaymentMode = (payload) =>
    payload?.paymentMode || (payload?.paymentId ? "Razorpay" : "Pay on Delivery");

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`${apiBaseUrl}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [apiBaseUrl]);

  const renderOrderCard = (order) => {
    const status = (order.paymentStatus || "Pending").toLowerCase();
    const chipColor = status === "paid" ? "success" : status === "pending" ? "warning" : "default";
    const orderDate = new Date(order.orderedAt || order.createdAt || Date.now()).toLocaleString();
    const discountAmount = Number(order.discountAmount || 0);
    const shippingFee = Number(order.shippingFee || 0);
    const amountPaid = status === "paid" ? order.totalAmount : 0;

    return (
      <Paper
        key={order._id}
        elevation={6}
        sx={{
          p: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #ffffff, #f5f7fb)",
          boxShadow: "0 18px 45px rgba(15,23,42,0.12)",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Order #{order._id.slice(-6)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Placed on {orderDate}
            </Typography>
          </Box>
          <Chip label={order.paymentStatus || "Pending"} color={chipColor} sx={{ fontWeight: 600 }} />
        </Box>

        <Divider />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
          {order.items.map((item, idx) => (
            <Box key={idx} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography fontWeight={500}>
                {item.name} × {item.quantity}
              </Typography>
              <Typography>{formatCurrency(item.price * item.quantity)}</Typography>
            </Box>
          ))}
        </Box>

        <Divider />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.4 }}>
          <Typography>Subtotal: {formatCurrency(order.totalAmount + discountAmount - shippingFee)}</Typography>
          {discountAmount > 0 && (
            <Typography color="success.main">
              Discount ({order.couponCode || "Coupon"}): -{formatCurrency(discountAmount)}
            </Typography>
          )}
          {shippingFee > 0 && <Typography>Shipping: {formatCurrency(shippingFee)}</Typography>}
          <Typography fontWeight={600}>Total Amount: {formatCurrency(order.totalAmount)}</Typography>
          <Typography fontWeight={600}>Amount Paid: {formatCurrency(amountPaid)}</Typography>
          <Typography color="text.secondary">Payment Mode: {resolvePaymentMode(order)}</Typography>
        </Box>
      </Paper>
    );
  };

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 }, py: 6 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={4}>
          📦 Your Orders
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" textAlign="center">
            {error}
          </Typography>
        ) : orders.length === 0 ? (
          <Typography color="text.secondary" textAlign="center">
            No previous orders found.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {orders.map((order) => (
              <Grid item xs={12} md={6} lg={4} key={order._id}>
                {renderOrderCard(order)}
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </MainLayout>
  );
};

export default OrderPage;
