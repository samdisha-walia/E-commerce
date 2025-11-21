//backend/controllers/orderController.js

const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

const Order = require('../models/Order');

// Save new order to DB
exports.saveOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      discountAmount = 0,
      couponCode = null,
      shippingFee = 0,
      address = '',
      paymentStatus = 'Pending',
      paymentId = null,
      orderedAt = null,
    } = req.body || {};

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: 'Order items are required.' });
    }

    if (typeof totalAmount !== 'number' || totalAmount <= 0) {
      return res.status(400).json({ message: 'Total amount must be greater than zero.' });
    }

    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const normalizedItems = items.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      productId: item.productId || item.id || item._id || null,
    }));

    const newOrder = new Order({
      user: userId,
      items: normalizedItems,
      totalAmount,
      discountAmount,
      couponCode,
      shippingFee,
      address,
      paymentStatus,
      paymentId,
      orderedAt,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order saved successfully', order: newOrder });
  } catch (error) {
    console.error('❌ Error saving order:', error);
    res.status(500).json({ message: 'Failed to save order' });
  }
};

// Fetch orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};


exports.sendOrderReceipt = async (req, res) => {
  try {
    const { order, user } = req.body;

    const formatCurrency = (value = 0) =>
      `₹${Number(value || 0).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

    const resolveDate = () => {
      const raw = order?.orderedAt || order?.date || Date.now();
      const dateObj = new Date(raw);
      if (Number.isNaN(dateObj.getTime())) {
        return new Date();
      }
      return dateObj;
    };

    const orderDate = resolveDate();

    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);

      // Send via Email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: '🧾 Your Shop-Top Order Receipt',
        text: 'Thank you for your order. Please find your receipt attached.',
        attachments: [
          {
            filename: `ShopTop_Receipt_${Date.now()}.pdf`,
            content: pdfData,
            contentType: 'application/pdf',
          },
        ],
      });

      res.status(200).json({ msg: 'Receipt emailed successfully.' });
    });

    // === 🧾 Generate PDF content ===
    doc.fontSize(20).text('Shop-Top Receipt', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Date: ${orderDate.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })}`);
    doc.text(`Receipt #: ${Math.floor(100000 + Math.random() * 900000)}`);
    doc.moveDown();

    doc.text(`Customer Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Address: ${order.address || 'No address provided'}`);
    doc.moveDown();

    doc.text('Order Items:', { underline: true });
    order.items.forEach((item, idx) => {
      const lineTotal = Number(item.price || 0) * Number(item.quantity || 0);
      doc.text(`${idx + 1}. ${item.name} × ${item.quantity} — ${formatCurrency(lineTotal)}`);
    });

    const totalAmount = Number(order.total ?? order.totalAmount ?? 0);
    const isPaid = (order.paymentStatus || '').toLowerCase() === 'paid';
    const paidAmount = isPaid ? totalAmount : 0;
    const paymentMode = order.paymentMode || (order.paymentId ? 'Razorpay' : 'Pay on Delivery');
    const discountAmount = Number(order.discountAmount || 0);
    const shippingFee = Number(order.shippingFee || 0);

    doc.moveDown();
    doc.font('Helvetica-Bold');
    doc.text(`Subtotal: ${formatCurrency(totalAmount + discountAmount - shippingFee)}`);
    if (discountAmount > 0) {
      doc.text(`Discount (${order.couponCode || 'Coupon'}): -${formatCurrency(discountAmount)}`);
    }
    if (shippingFee > 0) {
      doc.text(`Shipping: ${formatCurrency(shippingFee)}`);
    }
    doc.text(`Total Amount: ${formatCurrency(totalAmount)}`);
    doc.text(`Amount Paid: ${formatCurrency(paidAmount)}`);
    doc.font('Helvetica').moveDown();
    doc.text(`Payment Status: ${order.paymentStatus || 'Pending'}`);
    doc.text(`Payment Mode: ${paymentMode}`);
    doc.moveDown().text('Thank you for shopping with us!');


    doc.end();

  } catch (err) {
    console.error('❌ PDF Generation or Email Error:', err);
    res.status(500).json({ msg: 'Failed to send receipt.' });
  }
};
