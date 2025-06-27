// src/pages/SettingsPage.js
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

    window.location.reload(); // reload site to reflect theme/lang changes
  };

  return (
    <MainLayout>
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 2 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          <SettingsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Site Settings
        </Typography>

        <Divider sx={{ my: 2 }} />

        <FormControlLabel
          control={
            <Switch checked={tempDarkMode} onChange={(e) => setTempDarkMode(e.target.checked)} color="primary" />
          }
          label="Enable Dark Mode"
        />

        <Divider sx={{ my: 2 }} />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Preferred Currency</InputLabel>
          <Select value={tempCurrency} label="Preferred Currency" onChange={(e) => setTempCurrency(e.target.value)}>
            <MenuItem value="INR">INR (₹)</MenuItem>
            <MenuItem value="USD">USD ($)</MenuItem>
            <MenuItem value="EUR">EUR (€)</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Language</InputLabel>
          <Select value={tempLanguage} label="Language" onChange={(e) => setTempLanguage(e.target.value)}>
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="hi">Hindi</MenuItem>
            <MenuItem value="fr">French</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={applyChanges}
          sx={{ mt: 3, px: 3, py: 1.2, fontWeight: 600 }}
        >
          ✅ Apply Changes
        </Button>

        <Typography mt={3} color="text.secondary" fontSize="0.85rem">
          * Preferences are saved in your browser and applied across the site.
        </Typography>
      </Paper>
    </Box></MainLayout>
  );
};

export default SettingsPage;
