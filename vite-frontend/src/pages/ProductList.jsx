import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar, Toolbar, IconButton, Typography, Box, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Divider, Badge, Snackbar, Alert, Slide, useTheme
} from "@mui/material";
import {
  Menu as MenuIcon, Home as HomeIcon, ShoppingCart as ShoppingCartIcon,
  AccountCircle as AccountCircleIcon, History as HistoryIcon,
  SupportAgent as SupportAgentIcon, Settings as SettingsIcon, Logout as LogoutIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { CartContext } from "../context/CartContext";
import productsData from "../data/products";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ThemeToggle from "../components/ThemeToggle";

const drawerWidth = 250;

const ProductList = () => {
  const { t } = useTranslation();
  const { addToCart, cartItems } = useContext(CartContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const user = JSON.parse(localStorage.getItem("user"));

  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    if (localStorage.getItem("justLoggedIn") === "true") {
      setShowWelcome(true);
      localStorage.removeItem("justLoggedIn");
      setTimeout(() => setShowWelcome(false), 4000);
    }
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2500);
  };

  const filteredProducts = productsData.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        transition: "background 0.4s ease, color 0.4s ease",
      }}
    >
      {/* 🎉 Alerts */}
      <Snackbar
        open={showWelcome}
        autoHideDuration={4000}
        onClose={() => setShowWelcome(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={(props) => <Slide {...props} direction="down" />}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          ✨ Welcome, {user?.name}!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showAlert}
        onClose={() => setShowAlert(false)}
        autoHideDuration={3000}
        TransitionComponent={(props) => <Slide {...props} direction="down" />}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          ✅ Added to cart!
        </Alert>
      </Snackbar>

      {/* 🌟 AppBar */}
      <AppBar
        position="fixed"
        sx={{
          background: isDark
            ? "rgba(25, 25, 25, 0.7)"
            : "rgba(255,255,255,0.8)",
          backdropFilter: "blur(15px)",
          color: theme.palette.text.primary,
          boxShadow: isDark
            ? "0 1px 15px rgba(255,255,255,0.05)"
            : "0 1px 20px rgba(0,0,0,0.05)",
          transition: "background 0.4s ease, color 0.3s ease",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton color="inherit" onClick={() => setDrawerOpen(!drawerOpen)}>
            <MenuIcon />
          </IconButton>

          <Typography
            onClick={() => navigate("/products")}
            sx={{
              fontWeight: 700,
              fontSize: "1.6rem",
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
              letterSpacing: "-0.5px",
              color: theme.palette.text.primary,
            }}
          >
            Shop<span style={{ color: isDark ? "#aaa" : "#888" }}>Top</span>
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ThemeToggle />
            <LanguageSwitcher theme={isDark ? "dark" : "light"} />
            <Link
              to="/cart"
              style={{
                textDecoration: "none",
                color: theme.palette.text.primary,
              }}
            >
              <Badge badgeContent={cartItems?.length || 0} color="error">
                <ShoppingCartIcon />
              </Badge>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 🧭 Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backdropFilter: "blur(12px)",
            background: isDark
              ? "rgba(25,25,25,0.85)"
              : "rgba(255,255,255,0.85)",
            color: theme.palette.text.primary,
            boxShadow: isDark
              ? "2px 0 15px rgba(255,255,255,0.08)"
              : "2px 0 15px rgba(0,0,0,0.05)",
            transition: "background 0.4s ease, color 0.4s ease",
          },
        }}
      >
        <Divider sx={{ mt: 8, borderColor: isDark ? "#333" : "#ddd" }} />
        <List>
          {[{ icon: <HomeIcon />, text: "Home", path: "/products" },
          { icon: <AccountCircleIcon />, text: "Profile", path: "/profile" },
          { icon: <HistoryIcon />, text: "Orders", path: "/orders" },
          { icon: <SupportAgentIcon />, text: "Support", path: "/support" },
          { icon: <SettingsIcon />, text: "Settings", path: "/settings" },
          ].map((item) => (
            <ListItemButton key={item.text} onClick={() => navigate(item.path)}>
              <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
          <Divider sx={{ borderColor: isDark ? "#333" : "#ddd" }} />
          <ListItemButton onClick={() => navigate("/login")}>
            <ListItemIcon sx={{ color: theme.palette.text.primary }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Drawer>

      {/* 🛍 Product Grid */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 6,
          pt: 12,
          transition: "background 0.4s ease, color 0.4s ease",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 700,
            mb: 4,
            fontFamily: "Inter, sans-serif",
            color: theme.palette.text.primary,
          }}
        >
          Discover our Premium Collection
        </Typography>

        {/* 🔍 Filters */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mb: 4,
            flexWrap: "wrap",
          }}
        >
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "12px 18px",
              borderRadius: "14px",
              border: `1px solid ${isDark ? "#444" : "#ddd"}`,
              fontSize: "1rem",
              width: "220px",
              background: isDark ? "#1c1c1c" : "#fff",
              color: theme.palette.text.primary,
              boxShadow: isDark
                ? "0 2px 10px rgba(255,255,255,0.04)"
                : "0 2px 10px rgba(0,0,0,0.03)",
              transition: "background 0.4s ease, color 0.4s ease",
            }}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: "12px 18px",
              borderRadius: "14px",
              border: `1px solid ${isDark ? "#444" : "#ddd"}`,
              fontSize: "1rem",
              background: isDark ? "#1c1c1c" : "#fff",
              color: theme.palette.text.primary,
              boxShadow: isDark
                ? "0 2px 10px rgba(255,255,255,0.04)"
                : "0 2px 10px rgba(0,0,0,0.03)",
              transition: "background 0.4s ease, color 0.4s ease",
            }}
          >
            <option value="All">All Categories</option>
            <option value="Clothing">Clothing</option>
            <option value="Electronics">Electronics</option>
            <option value="Footwear">Footwear</option>
            
          </select>
        </Box>

        {/* 🧩 Product Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
            gap: 4,
          }}
        >
          {filteredProducts.map((product) => (
            <Tilt key={product.id} glareEnable glareMaxOpacity={0.2} scale={1.02}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: isDark
                    ? "linear-gradient(145deg, #1e1e1e, #252525)"
                    : "linear-gradient(145deg, #fff, #f5f5f5)",
                  borderRadius: "1.25rem",
                  padding: "1.6rem",
                  textAlign: "center",
                  boxShadow: isDark
                    ? "0 8px 18px rgba(255,255,255,0.05)"
                    : "0 8px 20px rgba(0,0,0,0.05)",
                  color: theme.palette.text.primary,
                  transition: "background 0.4s ease, color 0.4s ease",
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "1rem",
                    marginBottom: "1rem",
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {product.name}
                </Typography>
                <Typography sx={{ opacity: 0.8, mb: 2 }}>
                  ₹{product.price}
                </Typography>
                <motion.button
                  onClick={() => handleAddToCart(product)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: isDark ? "#fff" : "#111",
                    color: isDark ? "#000" : "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 20px",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    transition: "background 0.4s ease, color 0.4s ease",
                  }}
                >
                  Add to Cart
                </motion.button>
              </motion.div>
            </Tilt>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ProductList;
