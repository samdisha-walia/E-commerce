// backend/routes/paymentRoutes.js
const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    console.log("📦 Incoming amount:", amount);

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount provided" });
    }

    const options = {
      amount: Math.round(amount * 100), // convert rupees → paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log("✅ Razorpay Order created:", order);

    // ✅ Send valid response
    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("❌ Razorpay Error:", err);
    res.status(500).json({ error: "Razorpay order creation failed" });
  }
});

module.exports = router;
