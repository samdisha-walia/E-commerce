// vite-frontend/src/pages/CheckoutPage.jsx

import React, { useContext, useMemo, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Grid,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Divider,
} from "@mui/material";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import { motion } from "framer-motion";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    clearCart,
    subtotal,
    payableTotal,
    coupon,
    discountAmount,
  } = useContext(CartContext);
  const apiBaseUrl = useMemo(() => {
    const base = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
    return base || "http://localhost:5000";
  }, []);

  const mrp = cartItems.reduce(
    (sum, item) => sum + (item.mrp || item.price) * item.quantity,
    0
  );

  const freeShipThreshold = 2000;
  const remaining = Math.max(freeShipThreshold - subtotal, 0);
  const shippingFee = remaining > 0 && subtotal > 0 ? 49 : 0;
  const finalTotal = payableTotal + shippingFee;

  const [submitted, setSubmitted] = useState(false);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [paymentMode, setPaymentMode] = useState("pod");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // Load Razorpay Script
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const createRazorpayOrder = async (amount) => {
    const { data } = await axios.post(
      `${apiBaseUrl}/api/auth/payment/create-order`,
      { amount }
    );
    return data;
  };

  const getToken = () => localStorage.getItem("token");

  const ensureAuth = () => {
    const token = getToken();
    if (!token) {
      alert("Please login to place an order.");
      navigate("/login");
      return false;
    }
    return true;
  };

  const buildOrderPayload = (status, paymentId = null) => ({
    items: cartItems,
    totalAmount: finalTotal,
    discountAmount,
    couponCode: coupon?.code || null,
    shippingFee,
    address: `${name}, ${address}, ${city} - ${postalCode}`,
    paymentStatus: status,
    paymentId,
    orderedAt: new Date().toISOString(),
  });

  const saveOrder = async (payload) => {
    const token = getToken();
    if (!token) {
      throw new Error("Not authenticated");
    }
    await axios.post(`${apiBaseUrl}/api/orders`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };

  const sendReceipt = (orderPayload, paymentStatus) =>
    axios.post(`${apiBaseUrl}/api/orders/send-receipt`, {
      order: {
        ...orderPayload,
        total: orderPayload.totalAmount,
        paymentStatus,
      },
      user,
    });

  // 🟢 PAY WITH RAZORPAY
  const handleRazorpay = async () => {
    if (!subtotal) return alert("Cart is empty.");
    if (!ensureAuth()) return;

    const loaded = await loadRazorpayScript();
    if (!loaded) return alert("Failed to load Razorpay.");

    try {
      const orderData = await createRazorpayOrder(finalTotal);
      const orderPayload = buildOrderPayload("Paid");

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: "INR",
        name: "Shop-Top",
        description: "Order Payment",
        order_id: orderData.id,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#000000" },

        // ⭐ RAZORPAY SUCCESS HANDLER
        handler: async function (response) {
          try {
            const payload = {
              ...orderPayload,
              paymentId: response.razorpay_payment_id,
            };
            await saveOrder(payload);
            await sendReceipt(payload, "Paid");
            clearCart();
            setSubmitted(true);
            navigate("/thank-you");
          } catch (err) {
            console.error("Order save error:", err);
            alert("Payment captured but failed to save order. Please contact support.");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", (response) => {
        alert("Payment Failed.");
        console.error(response);
      });
    } catch (err) {
      console.error("Razorpay Error:", err);
    }
  };

  // 🟢 PAY ON DELIVERY
  const handlePOD = async (e) => {
    e.preventDefault();
    if (!subtotal) {
      alert("Cart is empty.");
      return;
    }
    if (!ensureAuth()) return;

    const payload = buildOrderPayload("Pending");

    try {
      await saveOrder(payload);
      await sendReceipt(payload, "Pending");
      clearCart();
      setSubmitted(true);
      navigate("/thank-you");
    } catch (error) {
      console.error("Order Save Error:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  const buttonStyle = {
    mt: 3,
    py: 1.4,
    background: "linear-gradient(135deg, #000, #555, #fff)",
    color: "#fff",
    fontWeight: 600,
    fontSize: "1rem",
    borderRadius: "10px",
    "&:hover": {
      background: "linear-gradient(135deg, #111, #666, #ddd)",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ width: "100%", padding: "60px 20px" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          maxWidth: "1300px",
          mx: "auto",
          gap: 4,
        }}
      >
        {/* LEFT SECTION — DELIVERY DETAILS */}
        <Paper
          elevation={6}
          sx={{
            flex: 1,
            p: { xs: 3, md: 5 },
            borderRadius: 5,
            background: "linear-gradient(to bottom right, #fff, #f5f5f5)",
          }}
        >
          <Typography variant="h5" mb={3} textAlign="center" fontWeight={700}>
            <LocalMallIcon sx={{ mr: 1, color: "#000" }} />
            Delivery Details
          </Typography>

          {submitted && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Order placed successfully! Redirecting...
            </Alert>
          )}

          <form onSubmit={handlePOD}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Full Name" fullWidth required value={name} onChange={(e) => setName(e.target.value)} />
              </Grid>

              <Grid item xs={12}>
                <TextField label="Shipping Address" fullWidth required value={address} onChange={(e) => setAddress(e.target.value)} />
              </Grid>

              <Grid item xs={6}>
                <TextField label="City" fullWidth required value={city} onChange={(e) => setCity(e.target.value)} />
              </Grid>

              <Grid item xs={6}>
                <TextField label="Postal Code" fullWidth required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
              </Grid>

              <Grid item xs={12}>
                <FormLabel>Payment Mode</FormLabel>
                <RadioGroup
                  row
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  <FormControlLabel value="pod" control={<Radio />} label="Pay on Delivery" />
                  <FormControlLabel value="razorpay" control={<Radio />} label="Pay with Razorpay" />
                </RadioGroup>
              </Grid>
            </Grid>

            <Typography mt={3} fontWeight={600} fontSize="1.2rem">
              Payable Total: ₹{finalTotal.toFixed(2)}
            </Typography>

            {paymentMode === "pod" ? (
              <Button type="submit" fullWidth sx={buttonStyle}>
                Place Order (Pay on Delivery)
              </Button>
            ) : (
              <Button fullWidth onClick={handleRazorpay} sx={buttonStyle}>
                Pay with Razorpay
              </Button>
            )}
          </form>
        </Paper>

        {/* RIGHT SECTION — ORDER SUMMARY */}
        <Paper
          elevation={6}
          sx={{
            flex: 1,
            p: { xs: 3, md: 5 },
            borderRadius: 5,
            background: "linear-gradient(to bottom right, #fafafa, #f3f3f3)",
            position: { md: "sticky" },
            top: 100,
          }}
        >
          <Typography variant="h5" fontWeight={700} mb={3}>
            Order Summary
          </Typography>

          <Box sx={{ mb: 2, maxHeight: "300px", overflowY: "auto" }}>
            {cartItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography>{item.name} × {item.quantity}</Typography>
                <Typography fontWeight={600}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2">MRP: ₹{mrp.toFixed(2)}</Typography>
          <Typography variant="body1" fontWeight={600}>
            Subtotal: ₹{subtotal.toFixed(2)}
          </Typography>
          {coupon && (
            <Typography variant="body2" color="success.main">
              {coupon.code} applied — you saved ₹{discountAmount.toFixed(2)}
            </Typography>
          )}
          <Typography variant="body2" sx={{ mt: 1 }}>
            Shipping: {shippingFee > 0 ? `₹${shippingFee}` : "Free"}
          </Typography>
          <Typography variant="h6" fontWeight={700} mt={2}>
            Total Payable: ₹{finalTotal.toFixed(2)}
          </Typography>
        </Paper>
      </Box>
    </motion.div>
  );
};

export default CheckoutPage;
