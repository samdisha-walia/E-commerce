import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Drawer, List, ListItem, ListItemIcon, ListItemText,
  IconButton, Toolbar, AppBar,  Box, Divider, Snackbar, Alert
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
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher'; // 👈 Add this line
import HomeIcon from '@mui/icons-material/Home';




const drawerWidth = 240;

const ProductList = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const { addToCart, cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [showAlert, setShowAlert] = useState(false);



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
        navigate('/profile');
        break;
      case 'orders':
        navigate('/orders');
        break;
      case 'support':
        navigate('/support');
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

  const handleAddToCart = (product) => {
  addToCart(product);
  setShowAlert(true);
  setTimeout(() => setShowAlert(false), 3000); // hide after 3s
};

  const filteredProducts = productsData.filter(product =>
    (category === 'All' || product.category === category) &&
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Snackbar
        open={showWelcome}
        autoHideDuration={4000}
        onClose={() => setShowWelcome(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={(props) => <Slide {...props} direction="down" />}
      >
        <Alert severity="success" sx={{ width: '100%', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: '600', background: '#d1e7dd', color: '#0f5132' }}>
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


      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
                flexGrow: 1,
                textAlign: 'center',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                userSelect: 'none',
            }}
            onClick={() => navigate('/products')}
            >
            🛍️ Shop-Top
            </Box>


          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LanguageSwitcher />
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
                transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffd700')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#fff')}
            >
                <Badge badgeContent={cartItems?.length || 0} color="error">
                <ShoppingCartIcon />
                </Badge>
                {t('cart')}
            </Link>
            </Box>

                    
        </Toolbar>
      </AppBar>

      <Drawer variant="persistent" anchor="left" open={drawerOpen} sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', top: '64px' } }}>
        <Divider />
        <List>
          <ListItem button onClick={() => navigate('/products')}>
            <ListItemIcon><HomeIcon/></ListItemIcon>
            <ListItemText primary="Home" />
        </ListItem>  
          <ListItem button onClick={() => handleDrawerAction('profile')}>
            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
            <ListItemText primary={t('profile')} />
          </ListItem>
          <ListItem button onClick={() => handleDrawerAction('orders')}>
            <ListItemIcon><HistoryIcon /></ListItemIcon>
            <ListItemText primary={t('orders')} />
          </ListItem>
          <ListItem button onClick={() => handleDrawerAction('support')}>
            <ListItemIcon><SupportAgentIcon /></ListItemIcon>
            <ListItemText primary={t('support')} />
          </ListItem>
          <ListItem button onClick={() => handleDrawerAction('settings')}>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary={t('settings')} />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button onClick={() => handleDrawerAction('logout')}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary={t('logout')} />
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>{t('exploreProducts')}</h2>

        <div className="filters">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">{t('allCategories')}</option>
            <option value="Clothing">{t('clothing')}</option>
            <option value="Electronics">{t('electronics')}</option>
            <option value="Footwear">{t('footwear')}</option>
          </select>
        </div>

        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h4>{product.name}</h4>
              <p>₹{product.price}</p>
              <button onClick={() => handleAddToCart(product)}>{t('addToCart')}</button>
            </div>
          ))}
        </div>
      </Box>
    </Box>
  );
};

export default ProductList;
