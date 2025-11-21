const Order = require('../models/Order');

exports.listAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').sort({ createdAt: -1 });
    return res.json({ orders });
  } catch (error) {
    console.error('Failed to fetch all orders', error);
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({ message: 'paymentStatus is required.' });
    }

    const allowedStatuses = ['Pending', 'Paid', 'Failed', 'Refunded'];
    if (!allowedStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status.' });
    }

    const order = await Order.findByIdAndUpdate(id, { paymentStatus }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    return res.json({ order });
  } catch (error) {
    console.error('Failed to update order status', error);
    return res.status(500).json({ message: 'Failed to update order status' });
  }
};
