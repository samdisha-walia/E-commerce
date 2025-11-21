const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Coupon = require('../models/Coupon');

const coupons = [
  {
    code: 'CLOTH15',
    description: '15% off on clothing orders above ₹1,000',
    discountPercent: 15,
    minAmount: 1000,
    maxDiscount: 1500,
  },
  {
    code: 'TECH10',
    description: '10% off on electronics above ₹5,000',
    discountPercent: 10,
    minAmount: 5000,
    maxDiscount: 3000,
  },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Coupon.deleteMany({});
    await Coupon.insertMany(coupons);
    console.log(`✅ Seeded ${coupons.length} coupons.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Coupon seed failed:', error.message);
    process.exit(1);
  }
})();
