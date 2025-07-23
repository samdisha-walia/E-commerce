//backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authMiddleware } = require('../middleware/auth'); // ✅ fixed import
const { getUserOrders } = require('../controllers/orderController');

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.put('/change-password', authMiddleware, userController.changePassword);
router.delete('/delete-account', authMiddleware, userController.deleteAccount);

router.get('/orders', protect, getUserOrders); // ✅ works now

module.exports = router;
