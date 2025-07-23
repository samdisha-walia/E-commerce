// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Switch, FormControlLabel,
  Divider, Select, MenuItem, FormControl, InputLabel, Button
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import MainLayout from '../components/MainLayout';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const [language, setLanguage] = useState('en');

  const [tempDarkMode, setTempDarkMode] = useState(darkMode);
  const [tempCurrency, setTempCurrency] = useState(currency);
  const [tempLanguage, setTempLanguage] = useState(language);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode') === 'true';
    const savedCurrency = localStorage.getItem('currency') || 'INR';
    const savedLang = localStorage.getItem('language') || 'en';
    setDarkMode(savedTheme);
    setCurrency(savedCurrency);
    setLanguage(savedLang);
    setTempDarkMode(savedTheme);
    setTempCurrency(savedCurrency);
    setTempLanguage(savedLang);
  }, []);

  const applyChanges = () => {
    setDarkMode(tempDarkMode);
    setCurrency(tempCurrency);
    setLanguage(tempLanguage);

    localStorage.setItem('darkMode', tempDarkMode);
    localStorage.setItem('currency', tempCurrency);
    localStorage.setItem('language', tempLanguage);

    window.location.reload();
  };

  return (
    <MainLayout>
      <Box
        sx={{
          maxWidth: 800,
          mx: 'auto',
          mt: 6,
          px: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            borderRadius: '20px',
            p: { xs: 3, sm: 4 },
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            background: (theme) =>
              theme.palette.mode === 'dark' ? '#1e1e1e' : '#fafafa',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            display="flex"
            alignItems="center"
            gutterBottom
          >
            <SettingsIcon sx={{ mr: 1 }} />
            Site Settings
          </Typography>

          <Divider sx={{ my: 2 }} />

          <FormControlLabel
            control={
              <Switch
                checked={tempDarkMode}
                onChange={(e) => setTempDarkMode(e.target.checked)}
                color="primary"
              />
            }
            label="Enable Dark Mode"
          />

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Preferred Currency</InputLabel>
              <Select
                value={tempCurrency}
                label="Preferred Currency"
                onChange={(e) => setTempCurrency(e.target.value)}
              >
                <MenuItem value="INR">INR (₹)</MenuItem>
                <MenuItem value="USD">USD ($)</MenuItem>
                <MenuItem value="EUR">EUR (€)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={tempLanguage}
                label="Language"
                onChange={(e) => setTempLanguage(e.target.value)}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="hi">Hindi</MenuItem>
                <MenuItem value="fr">French</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Button
            variant="contained"
            onClick={applyChanges}
            sx={{
              mt: 4,
              px: 3,
              py: 1.4,
              fontWeight: 600,
              borderRadius: '12px',
              fontSize: '0.95rem',
              textTransform: 'none',
              backgroundColor: '#000',
  color: '#fff',
  boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
  '&:hover': {
    backgroundColor: '#333'
  }
            }}
          >
            Apply Changes
          </Button>

          <Typography
            mt={3}
            color="text.secondary"
            fontSize="0.85rem"
          >
            * Preferences are saved in your browser and applied across the site.
          </Typography>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default SettingsPage;
