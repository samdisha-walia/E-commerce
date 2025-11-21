// vite-frontend/src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Alert, Paper, Slide
} from '@mui/material';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [slideIn] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      // 👇 Replace this with your actual backend API endpoint
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(res.data.msg || "Password reset link sent to your email.");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to send password reset email.");
    }
  };

  return (
    <Slide direction="up" in={slideIn} mountOnEnter unmountOnExit>
      <Box
        component={Paper}
        elevation={4}
        sx={{
          maxWidth: 400,
          mx: 'auto',
          mt: 10,
          p: 4,
          borderRadius: 3,
          background: '#f9fbfd',
        }}
      >
        <Typography variant="h5" fontWeight={600} color="primary" textAlign="center" mb={2}>
          🔐 Forgot Password
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter your registered email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, py: 1.2, fontWeight: 600 }}>
            Send Reset Link
          </Button>
        </form>
      </Box>
    </Slide>
  );
};

export default ForgotPassword;
