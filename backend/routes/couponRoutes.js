const express = require('express');
const { listActiveCoupons, applyCoupon } = require('../controllers/couponController');

const router = express.Router();

router.get('/', listActiveCoupons);
router.post('/apply', applyCoupon);

module.exports = router;
