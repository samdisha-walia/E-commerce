// vite-frontend/src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Alert, Paper,
  InputAdornment, IconButton, Slide, LinearProgress, Link
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import zxcvbn from 'zxcvbn';

const ResetPassword = () => {
  const { token } = useParams(); // 📌 Get token from URL
  const navigate = useNavigate();
  const [slideIn] = useState(true);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const strength = zxcvbn(password || '');
  const strengthLevel = strength.score; // 0 to 4
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#d32f2f', '#f57c00', '#fbc02d', '#388e3c', '#2e7d32'];

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setMessage(res.data.msg || "Password reset successful!");
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.response?.data?.msg?.includes("expired")) {
        setError("This reset link has expired. Please request a new one.");
      } else {
        setError(err.response?.data?.msg || "Something went wrong.");
      }
    }
  };

  return (
    <Slide direction="up" in={slideIn} mountOnEnter unmountOnExit>
      <Box
        component={Paper}
        elevation={4}
        sx={{
          maxWidth: 450,
          mx: 'auto',
          mt: 10,
          p: 4,
          borderRadius: 3,
          background: '#f9fbfd',
        }}
      >
        <Typography variant="h5" fontWeight={600} color="primary" textAlign="center" mb={2}>
          🔁 Reset Your Password
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

        <form onSubmit={handleReset}>
          <TextField
            label="New Password"
            type={showPass ? 'text' : 'password'}
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPass(!showPass)}>
                    {showPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Password strength bar */}
          {password && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color={strengthColors[strengthLevel]}>
                Strength: {strengthLabels[strengthLevel]}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(strengthLevel + 1) * 20}
                sx={{
                  height: 6,
                  borderRadius: 5,
                  backgroundColor: '#eee',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: strengthColors[strengthLevel],
                  },
                }}
              />
            </Box>
          )}

          <TextField
            label="Confirm New Password"
            type={showConfirm ? 'text' : 'password'}
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, py: 1.2, fontWeight: 600 }}>
            Reset Password
          </Button>
        </form>

        {/* If token expired */}
        {error.includes('expired') && (
          <Typography textAlign="center" mt={2}>
            <Link component={RouterLink} to="/forgot-password" underline="hover">
              Request a new link
            </Link>
          </Typography>
        )}
      </Box>
    </Slide>
  );
};

export default ResetPassword;
