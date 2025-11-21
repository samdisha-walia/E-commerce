// src/components/MainLayout.jsx

import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Badge,
  Fade,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CartContext } from '../context/CartContext';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

const drawerWidth = 240;

const MainLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cartItems } = useContext(CartContext);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

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
    <Fade in={true} timeout={600}>
      <Box
        sx={{
          display: 'flex',
          transition: 'background 0.4s ease, color 0.4s ease',
        }}
      >
        {/* ===== AppBar ===== */}
        <AppBar
          position="fixed"
          elevation={isHomePage ? 0 : 3}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backdropFilter: isHomePage ? 'blur(16px)' : 'none',
            background: (theme) =>
              isHomePage
                ? theme.palette.mode === 'dark'
                  ? 'rgba(20,20,20,0.7)'
                  : 'rgba(255,255,255,0.7)'
                : theme.palette.background.paper,
            color: (theme) => theme.palette.text.primary,
            boxShadow: isHomePage
              ? '0 0 10px rgba(0,0,0,0.1)'
              : '0 0 6px rgba(0,0,0,0.2)',
            transition:
              'background 0.4s ease-in-out, color 0.4s ease-in-out, box-shadow 0.3s',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Drawer Icon */}
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
                userSelect: 'none',
                transition: 'color 0.4s ease',
              }}
            >
              🛍️ Shop-Top
            </Typography>

            {/* Right Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ThemeToggle />
              <LanguageSwitcher isHomePage={isHomePage} />

              <Link
                to="/cart"
                style={{
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  color: 'inherit',
                }}
              >
                <Badge badgeContent={cartItems?.length || 0} color="error">
                  <ShoppingCartIcon />
                </Badge>
                {t('cart')}
              </Link>
            </Box>
          </Toolbar>
        </AppBar>

        {/* ===== Drawer ===== */}
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
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? theme.palette.background.default
                  : theme.palette.background.paper,
              color: (theme) => theme.palette.text.primary,
              transition: 'background 0.4s ease, color 0.4s ease',
            },
          }}
        >
          <Divider
            sx={{
              borderColor: (theme) =>
                theme.palette.mode === 'dark' ? '#333' : '#ddd',
              transition: 'border-color 0.4s ease',
            }}
          />

          <List>
            <ListItemButton onClick={() => navigate('/products')}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>

            <ListItemButton onClick={() => handleDrawerAction('profile')}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary={t('profile')} />
            </ListItemButton>

            <ListItemButton onClick={() => handleDrawerAction('orders')}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary={t('orders')} />
            </ListItemButton>

            <ListItemButton onClick={() => handleDrawerAction('support')}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <SupportAgentIcon />
              </ListItemIcon>
              <ListItemText primary={t('support')} />
            </ListItemButton>

            <ListItemButton onClick={() => handleDrawerAction('settings')}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary={t('settings')} />
            </ListItemButton>
          </List>

          <Divider
            sx={{
              borderColor: (theme) =>
                theme.palette.mode === 'dark' ? '#333' : '#ddd',
              transition: 'border-color 0.4s ease',
            }}
          />

          <List>
            <ListItemButton onClick={() => handleDrawerAction('logout')}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={t('logout')} />
            </ListItemButton>
          </List>
        </Drawer>

        {/* ===== Page Content ===== */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            backgroundColor: (theme) => theme.palette.background.default,
            color: (theme) => theme.palette.text.primary,
            minHeight: '100vh',
            transition: 'background 0.4s ease, color 0.4s ease',
          }}
        >
          {children}
        </Box>
      </Box>
    </Fade>
  );
};

export default MainLayout;
