const express = require('express');
const { listAllOrders, updateOrderStatus } = require('../controllers/adminOrderController');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(protect, requireAdmin);

router.get('/', listAllOrders);
router.put('/:id', updateOrderStatus);

module.exports = router;
