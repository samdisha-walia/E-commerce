//src/pages/ThankYouPage.jsx

import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Paper, Divider, Button, Chip, CircularProgress } from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import DescriptionIcon from '@mui/icons-material/Description';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { motion } from 'framer-motion';
import axios from 'axios';

const ThankYouPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const apiBaseUrl = useMemo(() => {
    const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
    return base || 'http://localhost:5000';
  }, []);

  const formatCurrency = (value = 0) =>
    `₹${Number(value || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const resolvePaymentMode = (payload) =>
    payload?.paymentMode || (payload?.paymentId ? 'Razorpay' : 'Pay on Delivery');

  const resolveAmountPaid = (payload) =>
    (payload?.paymentStatus || '').toLowerCase() === 'paid' ? payload?.totalAmount || payload?.total || 0 : 0;

  useEffect(() => {
    const fetchLatestOrder = async () => {
      if (!user) {
        setError('Please log in to view your latest order.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Your session has expired. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`${apiBaseUrl}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const latestOrder = data.orders?.[0] || null;
        setOrder(latestOrder);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch your recent order.');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestOrder();
  }, [apiBaseUrl, user]);

  const orderDate = order
    ? new Date(order.orderedAt || order.createdAt || Date.now()).toLocaleString()
    : null;
  const amountPaid = order ? resolveAmountPaid(order) : 0;
  const paymentMode = order ? resolvePaymentMode(order) : 'Pay on Delivery';
  const discountAmount = Number(order?.discountAmount || 0);
  const shippingFee = Number(order?.shippingFee || 0);

  const generatePDF = () => {
    if (!order || !user?.email) return;

    const address = order?.address || 'No address provided';
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text('Shop-Top Receipt', 14, 20);
    doc.setFontSize(10);
    doc.text(`DATE: ${orderDate}`, 14, 28);
    doc.text(`Receipt #: ${Math.floor(100000 + Math.random() * 900000)}`, 14, 34);

    const toBlock = doc.splitTextToSize(`${user.name}\n${user.email}\n${address}`, 80);
    const fromBlock = ['Shop-Top', 'support@shop-top.com', 'India'];

    autoTable(doc, {
      startY: 40,
      head: [['FROM:', 'TO:']],
      body: [[fromBlock.join('\n'), toBlock.join('\n')]],
      theme: 'plain',
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 100 }
      }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Item Description', 'Qty', 'Price', 'Amount']],
      body: order.items.map(item => [
        item.name,
        item.quantity,
        `₹${item.price}`,
        `₹${item.price * item.quantity}`
      ]),
    });

    let cursorY = doc.lastAutoTable.finalY + 10;
    doc.text(`Subtotal: ${formatCurrency(order.totalAmount + discountAmount - shippingFee)}`, 10, cursorY);
    cursorY += 6;
    if (discountAmount > 0) {
      doc.text(`Discount: -${formatCurrency(discountAmount)} (${order.couponCode || 'Coupon'})`, 10, cursorY);
      cursorY += 6;
    }
    if (shippingFee > 0) {
      doc.text(`Shipping: ${formatCurrency(shippingFee)}`, 10, cursorY);
      cursorY += 6;
    }
    doc.text(`Total Amount: ${formatCurrency(order.totalAmount)}`, 10, cursorY);
    cursorY += 6;
    doc.text(`Amount Paid: ${formatCurrency(amountPaid)}`, 10, cursorY);
    cursorY += 6;
    doc.text(`Payment Mode: ${paymentMode}`, 10, cursorY);
    cursorY += 6;
    doc.text(`Payment Status: ${order.paymentStatus}`, 10, cursorY);
    cursorY += 10;
    doc.setFontSize(10);
    doc.text('Thank you for shopping with us!', 10, cursorY);

    doc.save(`ShopTop_Receipt_${Date.now()}.pdf`);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Typography color="error" textAlign="center">{error}</Typography>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Typography>No recent order found.</Typography>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: { xs: 2, md: 4 } }}>
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff, #f5f7fb)',
            boxShadow: '0 20px 50px rgba(15,23,42,0.12)',
          }}
        >
          <Typography variant="h4" fontWeight={700} gutterBottom>
            🎉 Thank You for Your Order!
          </Typography>
          <Typography color="text.secondary" mb={2}>
            Order placed on {orderDate}
          </Typography>

          <Chip
            label={order.paymentStatus || 'Pending'}
            color={(order.paymentStatus || '').toLowerCase() === 'paid' ? 'success' : 'warning'}
            sx={{ fontWeight: 600, textTransform: 'uppercase' }}
          />

          <Typography variant="subtitle2" mt={3} gutterBottom>
            Shipping to
          </Typography>
          <Typography variant="h6" fontWeight={600}>
            {user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {order.address || 'No address provided'}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {order.items.map((item, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500 }}>
                <Typography>
                  {item.name} × {item.quantity}
                </Typography>
                <Typography>{formatCurrency(item.price * item.quantity)}</Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography>Subtotal: {formatCurrency(order.totalAmount + discountAmount - shippingFee)}</Typography>
            {discountAmount > 0 && (
              <Typography color="success.main">
                Discount ({order.couponCode || 'Coupon'}): -{formatCurrency(discountAmount)}
              </Typography>
            )}
            {shippingFee > 0 && <Typography>Shipping: {formatCurrency(shippingFee)}</Typography>}
            <Typography fontWeight={600}>Total Amount: {formatCurrency(order.totalAmount)}</Typography>
            <Typography fontWeight={600}>Amount Paid: {formatCurrency(amountPaid)}</Typography>
            <Typography color="text.secondary">Payment Mode: {paymentMode}</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={generatePDF}
              sx={{
                borderColor: '#111827',
                color: '#111827',
                fontWeight: 600,
                px: 4,
                py: 1.2,
                borderRadius: 2,
                textTransform: 'none',
                width: { xs: '100%', sm: 'auto' },
              }}
              startIcon={<DescriptionIcon />}
            >
              Download Receipt
            </Button>

            <Button
              variant="contained"
              onClick={() => (window.location.href = '/products')}
              sx={{
                background: 'linear-gradient(135deg, #111827, #4338ca)',
                color: 'white',
                fontWeight: 600,
                px: 4,
                py: 1.2,
                borderRadius: 2,
                textTransform: 'none',
                width: { xs: '100%', sm: 'auto' },
              }}
              startIcon={<ShoppingCartIcon />}
            >
              Continue Shopping
            </Button>
          </Box>
        </Paper>
      </Box>
    </motion.div>
  );
}

export default ThankYouPage;
