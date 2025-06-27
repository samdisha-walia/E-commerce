import React, { useState, useContext } from 'react';
import {
  AppBar, Toolbar, IconButton,  Box,
  Drawer, List, ListItem, ListItemIcon, ListItemText,
  Divider, Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LanguageSwitcher from '../components/LanguageSwitcher'; // 👈 Add this line

import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CartContext } from '../context/CartContext';
import HomeIcon from '@mui/icons-material/Home';    

const drawerWidth = 240;

const MainLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cartItems } = useContext(CartContext);
  //const user = JSON.parse(localStorage.getItem('user'));

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



  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Left: Menu icon */}
          <IconButton color="inherit" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>

          {/* Center: Logo */}
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

          {/* Right: View Cart + Language */}
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

      {/* Drawer */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            top: 64,
            boxSizing: 'border-box'
          }
        }}
      >
        <Divider />
        <List>
          <ListItem button onClick={() => navigate('/products')}>
        <ListItemIcon><HomeIcon /></ListItemIcon>
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

      {/* Page Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
