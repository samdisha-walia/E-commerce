import React from 'react';
import { useTranslation } from 'react-i18next';
//import { MenuItem, Select, Box } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';



const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const handleChange = (event) => {
    const lang = event.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Select
        value={currentLang}
        onChange={handleChange}
        size="small"
        sx={{ color: 'white', borderColor: 'white', ml: 2, '& .MuiSelect-icon': { color: 'white' } }}
                  >
        <MenuItem value="en">EN</MenuItem>
        <MenuItem value="hi">HI</MenuItem>
        <MenuItem value="fr">FR</MenuItem>
      </Select>

      
    </Box>
  );
};

export default LanguageSwitcher;
