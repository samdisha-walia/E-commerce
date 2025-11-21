const Coupon = require('../models/Coupon');

const formatCouponResponse = (coupon) => ({
  code: coupon.code,
  description: coupon.description,
  discountPercent: coupon.discountPercent,
  minAmount: coupon.minAmount,
  maxDiscount: coupon.maxDiscount,
  expiresAt: coupon.expiresAt,
});

exports.listActiveCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gte: new Date() } }],
    }).sort({ createdAt: -1 });

    return res.json({ coupons: coupons.map(formatCouponResponse) });
  } catch (error) {
    console.error('Failed to fetch coupons', error);
    return res.status(500).json({ message: 'Failed to fetch coupons' });
  }
};

exports.applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal = 0 } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ message: 'Coupon code is required.' });
    }

    const coupon = await Coupon.findActiveByCode(code);

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found or expired.' });
    }

    if (cartTotal < coupon.minAmount) {
      return res.status(400).json({
        message: `Add ₹${(coupon.minAmount - cartTotal).toFixed(2)} more to use this coupon.`,
      });
    }

    const rawDiscount = (cartTotal * coupon.discountPercent) / 100;
    const discountAmount = Number(
      Math.min(rawDiscount, coupon.maxDiscount || rawDiscount).toFixed(2)
    );

    return res.json({
      coupon: formatCouponResponse(coupon),
      discountAmount,
      payableTotal: Number(Math.max(cartTotal - discountAmount, 0).toFixed(2)),
    });
  } catch (error) {
    console.error('Coupon apply error:', error);
    return res.status(500).json({ message: 'Failed to apply coupon.' });
  }
};
