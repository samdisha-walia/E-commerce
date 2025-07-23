// src/pages/ProductList.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Drawer, List, ListItem, ListItemIcon, ListItemText, Typography,
  IconButton, Toolbar, AppBar, Box, Divider, Snackbar, Alert, Badge
} from '@mui/material';
import {
  Menu as MenuIcon, AccountCircle as AccountCircleIcon, History as HistoryIcon,
  SupportAgent as SupportAgentIcon, Settings as SettingsIcon, Logout as LogoutIcon,
  ShoppingCart as ShoppingCartIcon, Home as HomeIcon
} from '@mui/icons-material';
import ListItemButton from '@mui/material/ListItemButton';
import { motion } from 'framer-motion';
import productsData from '../data/products';
import { CartContext } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Tilt from 'react-parallax-tilt';
import Slide from '@mui/material/Slide';


const drawerWidth = 240;

const ProductList = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const { addToCart, cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (localStorage.getItem('justLoggedIn') === 'true') {
      setShowWelcome(true);
      localStorage.removeItem('justLoggedIn');
      setTimeout(() => setShowWelcome(false), 4000);
    }
  }, []);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const handleDrawerAction = (action) => {
    const paths = {
      profile: '/profile',
      orders: '/orders',
      support: '/support',
      settings: '/settings',
      logout: '/login',
    };
    if (action === 'logout') {
      localStorage.clear();
    }
    if (paths[action]) navigate(paths[action]);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const filteredProducts = productsData.filter(product =>
    (category === 'All' || product.category === category) &&
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f9f9f9', minHeight: '100vh' }}>
      {/* ✅ Snackbar Alerts */}
      <Snackbar
        open={showWelcome}
        autoHideDuration={4000}
        onClose={() => setShowWelcome(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={(props) => <Slide {...props} direction="down" />}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          🎉 {t('welcome')}, {user?.name}!
        </Alert>
      </Snackbar>
      <Snackbar
        open={showAlert}
        onClose={() => setShowAlert(false)}
        autoHideDuration={3000}
        TransitionComponent={(props) => <Slide {...props} direction="down" />}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          🛒 Added to cart!
        </Alert>
      </Snackbar>

      {/* ✅ Top Navbar */}
      <AppBar
        position="fixed"
        sx={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          color: '#000',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>

          <Typography
            onClick={() => navigate('/products')}
            sx={{
              fontWeight: 600,
              fontSize: '1.5rem',
              cursor: 'pointer',
              userSelect: 'none',
              fontFamily: 'SF Pro Display, sans-serif',
            }}
          >
            🛍️ Shop-Top
          </Typography>

          <Box sx={{ display: 'flex',color: '#000', alignItems: 'center', gap: 2 }}>
            <LanguageSwitcher theme="light"/>
            <Link to="/cart" style={{ color: '#000', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Badge badgeContent={cartItems?.length || 0} color="error">
                <ShoppingCartIcon />
              </Badge>
              {t('cart')}
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ✅ Drawer Menu */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            top: '64px',
            background: '#fff',
            boxShadow: '2px 0 6px rgba(0,0,0,0.05)'
          }
        }}
      >
        <Divider />
        <List>
          <ListItem disablePadding><ListItemButton onClick={() => navigate('/products')}><ListItemIcon><HomeIcon /></ListItemIcon><ListItemText primary="Home" /></ListItemButton></ListItem>
          <ListItem disablePadding><ListItemButton onClick={() => handleDrawerAction('profile')}><ListItemIcon><AccountCircleIcon /></ListItemIcon><ListItemText primary={t('profile')} /></ListItemButton></ListItem>
          <ListItem disablePadding><ListItemButton onClick={() => handleDrawerAction('orders')}><ListItemIcon><HistoryIcon /></ListItemIcon><ListItemText primary={t('orders')} /></ListItemButton></ListItem>
          <ListItem disablePadding><ListItemButton onClick={() => handleDrawerAction('support')}><ListItemIcon><SupportAgentIcon /></ListItemIcon><ListItemText primary={t('support')} /></ListItemButton></ListItem>
          <ListItem disablePadding><ListItemButton onClick={() => handleDrawerAction('settings')}><ListItemIcon><SettingsIcon /></ListItemIcon><ListItemText primary={t('settings')} /></ListItemButton></ListItem>
        </List>
        <Divider />
        <List>
          <ListItem disablePadding><ListItemButton onClick={() => handleDrawerAction('logout')}><ListItemIcon><LogoutIcon /></ListItemIcon><ListItemText primary={t('logout')} /></ListItemButton></ListItem>
        </List>
      </Drawer>

      {/* ✅ Main Content */}
      <Box component="main" sx={{ flexGrow: 1, px: 6, pt: 12, pb: 4 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: 700, mb: 4, color: '#1a1a1a' }}
        >
          {t('exploreProducts')}
        </Typography>

        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          mb: 4,
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #ddd',
              borderRadius: '12px',
              fontSize: '1rem',
              width: '220px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            }}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #ddd',
              borderRadius: '12px',
              fontSize: '1rem',
              background: '#fff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            }}
          >
            <option value="All">{t('allCategories')}</option>
            <option value="Clothing">{t('clothing')}</option>
            <option value="Electronics">{t('electronics')}</option>
            <option value="Footwear">{t('footwear')}</option>
          </select>
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 4
        }}>
          {filteredProducts.map(product => (
            <Tilt key={product.id} glareEnable={true} glareMaxOpacity={0.3} scale={1.02} transitionSpeed={250}>
            <motion.div
              
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{
                background: '#fff',
                padding: '1.5rem',
                borderRadius: '1.25rem',
                boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '180px',
                  objectFit: 'cover',
                  borderRadius: '1rem',
                  marginBottom: '1rem',
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {product.name}
              </Typography>
              <Typography variant="body1" sx={{ color: '#555', mb: 2 }}>
                ₹{product.price}
              </Typography>
              <button
                onClick={() => handleAddToCart(product)}
                style={{
                  background: '#000',
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#444')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#000')}
              >
                {t('addToCart')}
              </button>
            </motion.div>
            </Tilt>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ProductList;
