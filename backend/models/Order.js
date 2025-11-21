// backend/models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
      image: String,
      productId: String,
    },
  ],
  totalAmount: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  couponCode: { type: String, default: null },
  shippingFee: { type: Number, default: 0 },
  address: { type: String, default: '' },
  paymentStatus: { type: String, default: 'Pending' },
  paymentId: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
