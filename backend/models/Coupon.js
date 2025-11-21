const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: '' },
    discountPercent: { type: Number, required: true, min: 1, max: 100 },
    minAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

couponSchema.statics.findActiveByCode = function (code) {
  return this.findOne({
    code: code.toUpperCase(),
    isActive: true,
    $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gte: new Date() } }],
  });
};

module.exports = mongoose.model('Coupon', couponSchema);
