//backend/middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Named export
const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Named export
const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("Authorization Header:", authHeader);

  const token = authHeader?.split(" ")[1];
  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ msg: "No token" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Verified Token Payload:", verified);
    req.user = verified;
    next();
  } catch (err) {
    console.log("❌ Invalid token");
    res.status(401).json({ msg: "Invalid token" });
  }
};

// Correct way to export multiple
module.exports = {
  protect,
  authMiddleware
};
