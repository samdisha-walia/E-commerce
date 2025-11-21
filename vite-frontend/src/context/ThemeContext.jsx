import React, { createContext, useState, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ThemeModeContext = createContext();

export const useThemeMode = () => useContext(ThemeModeContext);

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#0071e3' : '#0a84ff', // Apple blue tone
      },
      background: {
        default: mode === 'light' ? '#f9fbfd' : '#0c0c0c',
        paper: mode === 'light' ? '#ffffff' : '#1a1a1a',
      },
      text: {
        primary: mode === 'light' ? '#000000' : '#f5f5f5',
        secondary: mode === 'light' ? '#555' : '#aaa',
      },
    },
    typography: {
      fontFamily: '"SF Pro Display", "Poppins", sans-serif',
    },
  }), [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
