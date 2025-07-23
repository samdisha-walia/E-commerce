//src/pages/ThankYouPage.jsx

import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Divider, Button
} from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import DescriptionIcon from '@mui/icons-material/Description';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { motion } from 'framer-motion';

const ThankYouPage = () => {
  const [order, setOrder] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return;

  const allOrders = JSON.parse(localStorage.getItem('orders')) || {};
  const userOrders = allOrders[user.email] || [];
  const latestOrder = userOrders[userOrders.length - 1];
  setOrder(latestOrder);
}, []);


  if (!order) {
    return <Typography mt={10} textAlign="center">No recent order found.</Typography>;
  }

  const generatePDF = () => {
    if (!user?.email) return;

    const orders = JSON.parse(localStorage.getItem('orders'));
    const userOrders = orders[user.email] || [];
    const latestOrder = userOrders.length ? userOrders[userOrders.length - 1] : null;

    if (!latestOrder) {
      alert("No recent order found.");
      return;
    }

    const address = latestOrder?.address || 'No address provided';
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text('Receipt', 160, 20);
    doc.setFontSize(10);
    doc.text(`DATE: ${new Date(latestOrder.date).toLocaleDateString()}`, 160, 28);
    doc.text(`Receipt #: ${Math.floor(Math.random() * 1000)}`, 160, 34);

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
      body: latestOrder.items.map(item => [
        item.name,
        item.quantity,
        `₹${item.price}`,
        `₹${item.price * item.quantity}`
      ]),
    });

    doc.text(`Total Paid: ₹${latestOrder.total.toFixed(2)}`, 10, doc.lastAutoTable.finalY + 10);
    doc.text(`Payment Mode: ${latestOrder.paymentStatus === 'Paid' ? 'Razorpay' : 'Pay on Delivery'}`, 10, doc.lastAutoTable.finalY + 20);
    doc.text(`Payment Status: ${latestOrder.paymentStatus}`, 10, doc.lastAutoTable.finalY + 30);
    doc.setFontSize(10);
    doc.text("Thank you for shopping with us!", 10, doc.lastAutoTable.finalY + 40);

    doc.save(`ShopTop_Receipt_${Date.now()}.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 1, p: 3 }}>
        <Paper elevation={4} sx={{
          p: 4,
          borderRadius: 3,
          textAlign: 'center',
          background: 'linear-gradient(to right, #ffffff, #f9f9f9)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            🎉 Thank You for Your Order!
          </Typography>
          <Typography color="text.secondary" mb={3}>
            We’ve received your order placed on {new Date(order.date).toLocaleString()}
          </Typography>

          <Typography variant="subtitle2" gutterBottom>
            To: {user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {order.address || 'No address provided'}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {order.items.map((item, i) => (
            <Typography key={i}>
              {item.name} × {item.quantity} — ₹{item.price * item.quantity}
            </Typography>
          ))}

          <Divider sx={{ my: 2 }} />

          <Typography fontWeight={600} fontSize="1.1rem">
            Total Payment: ₹{order.total.toFixed(2)}
          </Typography>

          <Typography fontWeight={600} fontSize="1.1rem">
            Total Paid: ₹{order.paymentStatus === 'Paid' ? order.total.toFixed(2) : '0.00'}
          </Typography>

          <Typography mt={1} fontSize="1rem" color={order.paymentStatus === 'Paid' ? 'green' : 'orange'}>
            {order.paymentStatus === 'Paid'
              ? '✅ Payment Completed via Razorpay'
              : '💰 Payment Pending - Pay on Delivery'}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={generatePDF}
              sx={{
                borderColor: '#1976d2',
                color: '#1976d2',
                fontWeight: 600,
                px: 4,
                py: 1.2,
                borderRadius: 2,
                textTransform: 'none'
              }}
              startIcon={<DescriptionIcon />}
            >
              Download Receipt
            </Button>

            <Button
              variant="contained"
              onClick={() => (window.location.href = '/products')}
              sx={{
                background: 'linear-gradient(135deg, rgb(29,31,151), rgb(65,97,238))',
                color: 'white',
                fontWeight: 600,
                px: 4,
                py: 1.2,
                borderRadius: 2,
                textTransform: 'none'
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
};

export default ThankYouPage;
