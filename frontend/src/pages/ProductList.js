import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Drawer, List, ListItem, ListItemIcon, ListItemText,
  IconButton, Toolbar, AppBar, Typography, Box, Divider, Snackbar, Alert
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';

import Slide from '@mui/material/Slide';

import productsData from '../data/products';
import { CartContext } from '../context/CartContext';
import './ProductList.css';

const drawerWidth = 240;

const ProductList = () => {
  // ✅ All hooks go here — inside the component function
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const user = JSON.parse(localStorage.getItem('user'));

  // ✅ useEffect for welcome message
  useEffect(() => {
    if (localStorage.getItem('justLoggedIn') === 'true') {
      setShowWelcome(true);
      localStorage.removeItem('justLoggedIn');
      setTimeout(() => setShowWelcome(false), 4000);
    }
  }, []);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const handleDrawerAction = (action) => {
    switch (action) {
      case 'profile':
        alert(`👤 Name: ${user?.name}\n📧 Email: ${user?.email}`);
        break;
      case 'orders':
        navigate('/orders');
        break;
      case 'support':
        window.location.href = 'mailto:support@shop-top.com';
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'logout':
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
        break;
      default:
        break;
    }
  };

  const filteredProducts = productsData.filter(product =>
    (category === 'All' || product.category === category) &&
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Snackbar Message */}
      <Snackbar
        open={showWelcome}
        autoHideDuration={4000}
        onClose={() => setShowWelcome(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={(props) => <Slide {...props} direction="down" />}
        >
        <Alert
            severity="success"
            sx={{
            width: '100%',
            borderRadius: '10px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            fontWeight: '600',
            background: '#d1e7dd',
            color: '#0f5132',
            }}
        >
            🎉 Welcome, {user?.name}!
        </Alert>
        </Snackbar>


      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
  <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    
    {/* Left: Drawer Icon */}
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 1 }}>
        <MenuIcon />
      </IconButton>
    </Box>

    {/* Center: Title */}
    <Typography
      variant="h4"
      sx={{
        fontWeight: '600',
        color: '#ffffff',
        fontFamily: 'Poppins, sans-serif',
        textAlign: 'center',
        flexGrow: 1,
      }}
    >
      🛍️ Shop-Top
    </Typography>

    {/* Right: View Cart */}
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Link
            to="/cart"
            style={{
            color: '#fff',
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: '1rem',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffd700')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#fff')}
        >
            <Badge badgeContent={cart?.length || 0} color="error">
                <ShoppingCartIcon />
            </Badge>
            View Cart
        </Link>
        </Box>


  </Toolbar>
</AppBar>


      {/* Drawer */}
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
            top: '64px'
          }
        }}
      >
        <Divider />
        <List>
          <ListItem button onClick={() => handleDrawerAction('profile')}>
            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
            <ListItemText primary="User Profile" />
          </ListItem>
          <ListItem button onClick={() => handleDrawerAction('orders')}>
            <ListItemIcon><HistoryIcon /></ListItemIcon>
            <ListItemText primary="Previous Orders" />
          </ListItem>
          <ListItem button onClick={() => handleDrawerAction('support')}>
            <ListItemIcon><SupportAgentIcon /></ListItemIcon>
            <ListItemText primary="Customer Support" />
          </ListItem>
          <ListItem button onClick={() => handleDrawerAction('settings')}>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button onClick={() => handleDrawerAction('logout')}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Explore Products</h2>

        {/* Filters */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Clothing">Clothing</option>
            <option value="Electronics">Electronics</option>
            <option value="Footwear">Footwear</option>
          </select>
        </div>

        {/* Product Cards */}
        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h4>{product.name}</h4>
              <p>₹{product.price}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </Box>
    </Box>
  );
};

export default ProductList;
