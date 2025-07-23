import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, Alert, Paper, InputAdornment, IconButton, Slide, Link
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const slideIn = true;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('justLoggedIn', 'true');
      alert("Login successful!");
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed. Please try again.");
    }
    if (!localStorage.getItem('memberSince')) {
      localStorage.setItem('memberSince', new Date().toISOString());
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
          LOG IN
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            fullWidth
            type="email"
            required
            variant="outlined"
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            label="Password"
            name="password"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            required
            variant="outlined"
            onChange={handleChange}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Typography textAlign="right" fontSize="0.85rem" mt={1}>
            <Link component={RouterLink} to="/forgot-password" underline="hover">
              Forgot Password?
            </Link>
          </Typography>


          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, py: 1.2, fontWeight: 600 }}>
            Login
          </Button>

          <Typography textAlign="center" mt={2} fontSize="0.9rem">
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register" underline="hover">
              Register
            </Link>
          </Typography>
        </form>
      </Box>
    </Slide>
  );
};

export default Login;
