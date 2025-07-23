//backend/controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      memberSince: user.createdAt
    });
  } catch (err) {
    console.error('Get Profile Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
// ✅ Update Name/Email/Avatar
exports.updateProfile = async (req, res) => {
  const { name, email, avatar } = req.body;
  const user = await User.findById(req.user.id);

  user.name = name || user.name;
  user.email = email || user.email;
  user.avatar = avatar || user.avatar;

  await user.save();
  res.json({ msg: "Profile updated", user: { name: user.name, email: user.email, avatar: user.avatar } });
};

// ✅ Change Password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Incorrect old password." });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ msg: "Password changed successfully." });
};

// ✅ Delete Account
exports.deleteAccount = async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  res.json({ msg: "Account deleted." });
};


// In controllers/userController.js
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};
