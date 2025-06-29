const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { forgotPassword, resetPassword } = require('../controllers/authController');


router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
