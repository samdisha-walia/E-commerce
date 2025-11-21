// src/components/ThemeToggle.jsx
import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeMode } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { mode, toggleMode } = useThemeMode();

  return (
    <Tooltip title={mode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}>
      <IconButton
        onClick={toggleMode}
        color="inherit"
        sx={{
          transition: "transform 0.3s ease",
          "&:hover": { transform: "rotate(20deg)" },
        }}
      >
        {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
