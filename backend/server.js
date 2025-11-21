// backend/server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require('./routes/paymentRoutes'); // Razorpay
const chatRoutes = require('./routes/chatRoutes');
const couponRoutes = require('./routes/couponRoutes');
const adminCategoryRoutes = require('./routes/adminCategoryRoutes');
const adminProductRoutes = require('./routes/adminProductRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');



const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/payment', paymentRoutes); // Razorpay route
app.use('/api/user', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/orders', adminOrderRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
