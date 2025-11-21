// backend/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const { saveOrder,
  getUserOrders, sendOrderReceipt } = require('../controllers/orderController');

const { protect } = require('../middleware/auth');

router.post('/send-receipt', sendOrderReceipt); // Public route
router.post('/', protect, saveOrder);           // Save order
router.get('/', protect, getUserOrders); // Get user's orders


module.exports = router;
