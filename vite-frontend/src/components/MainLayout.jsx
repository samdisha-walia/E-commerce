// src/components/MainLayout.jsx

import React, { useState, useContext } from 'react';
import {
  AppBar, Toolbar, IconButton, Box,
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import { useLocation } from 'react-router-dom';

import LanguageSwitcher from './LanguageSwitcher';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CartContext } from '../context/CartContext';

const drawerWidth = 240;

const MainLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cartItems } = useContext(CartContext);
  const location = useLocation();
  const isHomePage = location.pathname === "/";


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
      <AppBar
        position="fixed"
        elevation={isHomePage ? 0 : 3}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: isHomePage ? 'blur(16px)' : 'none',
          background: isHomePage ? 'rgba(255, 255, 255, 0.1)' : '#111',
          color: isHomePage ? '#fff' : '#fff',
          boxShadow: isHomePage ? '0 0 10px rgba(255,255,255,0.1)' : undefined,
          transition: 'background 0.3s ease-in-out',
        }}
      >

        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Menu Icon */}
          <IconButton color="inherit" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography
            onClick={() => navigate('/products')}
            sx={{
              flexGrow: 1,
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '1.6rem',
              cursor: 'pointer',
              color: 'white',
              userSelect: 'none',
            }}
          >
            🛍️ Shop-Top
          </Typography>

          {/* Cart & Language */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LanguageSwitcher isHomePage={isHomePage} />

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
            boxSizing: 'border-box',
            backgroundColor: '#f9f9f9',
            paddingTop: '8px',
          },
        }}
      >
        <Divider />
        <List>
          <ListItemButton onClick={() => navigate('/products')}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>

          <ListItemButton onClick={() => handleDrawerAction('profile')}>
            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
            <ListItemText primary={t('profile')} />
          </ListItemButton>

          <ListItemButton onClick={() => handleDrawerAction('orders')}>
            <ListItemIcon><HistoryIcon /></ListItemIcon>
            <ListItemText primary={t('orders')} />
          </ListItemButton>

          <ListItemButton onClick={() => handleDrawerAction('support')}>
            <ListItemIcon><SupportAgentIcon /></ListItemIcon>
            <ListItemText primary={t('support')} />
          </ListItemButton>

          <ListItemButton onClick={() => handleDrawerAction('settings')}>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary={t('settings')} />
          </ListItemButton>
        </List>

        <Divider />
        <List>
          <ListItemButton onClick={() => handleDrawerAction('logout')}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary={t('logout')} />
          </ListItemButton>
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
