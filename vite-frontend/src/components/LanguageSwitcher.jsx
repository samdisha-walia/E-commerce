import React from 'react';
import { useTranslation } from 'react-i18next';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

const LanguageSwitcher = ({ theme = 'dark' }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const isDark = theme === 'dark';

  const handleChange = (event) => {
    const lang = event.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
      }}
    >
      <Select
        value={currentLang}
        onChange={handleChange}
        size="small"
        sx={{
          color: isDark ? 'white' : 'black',
          border: `1px solid ${isDark ? 'white' : 'black'}`,
          transition: 'all 0.3s ease-in-out', // 🔥 Smooth transition

          backgroundColor: isDark ? 'transparent' : 'rgba(255,255,255,0.6)',
          borderRadius: '8px',
          minWidth: 70,
          fontWeight: 'bold',
          fontSize: '0.9rem',
          boxShadow: isDark ? 'none' : '0 2px 6px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',

          '&:hover': {
            backgroundColor: isDark ? '#333' : 'rgba(255,255,255,0.8)',
          },
          '& .MuiSvgIcon-root': {
            color: isDark ? 'white' : 'black',
            transition: 'color 0.3s ease-in-out',

          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#575755ff', // Optional: golden glow on hover
            },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent',
            transition: 'border-color 0.3s ease-in-out',

          },
          '& .MuiSelect-icon': {
            color: isDark ? 'white' : 'black',
          },
        }}
      >
        <MenuItem value="en">EN</MenuItem>
        <MenuItem value="hi">HI</MenuItem>
        <MenuItem value="fr">FR</MenuItem>
      </Select>
    </Box>
  );
};

export default LanguageSwitcher;
