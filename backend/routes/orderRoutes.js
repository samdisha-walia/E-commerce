const express = require('express');
const router = express.Router();
const { sendOrderReceipt } = require('../controllers/orderController');

router.post('/send-receipt', sendOrderReceipt);

module.exports = router;
