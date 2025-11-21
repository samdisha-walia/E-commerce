// vite-frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, Alert, Paper,
  InputAdornment, IconButton, Slide, Link
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const slideIn = true;
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    localStorage.setItem('memberSince', new Date().toISOString());


    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      alert(res.data.msg);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
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
          mt: 8,
          p: 4,
          borderRadius: 3,
          background: '#f9fbfd',
        }}
      >
        <Typography variant="h5" fontWeight={600} color="primary" textAlign="center" mb={2}>
          Create Your Account
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            required
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type={showPass ? 'text' : 'password'}
            fullWidth
            required
            onChange={handleChange}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                    {showPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            fullWidth
            required
            onChange={handleChange}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, py: 1.2, fontWeight: 600 }}>
            Register
          </Button>

          <Typography textAlign="center" mt={2} fontSize="0.9rem">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" underline="hover">
              Login
            </Link>
          </Typography>
        </form>
      </Box>
    </Slide>
  );
};

export default Register;
