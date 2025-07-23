// src/pages/CustomerSupport.js
import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper, Alert
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';

import MainLayout from '../components/MainLayout';

const CustomerSupport = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Support message:", { from: user.email, message: query });
    setSubmitted(true);
    setQuery('');
  };

  return (
    <MainLayout>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, px: 2 }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            maxWidth: 600,
            width: '100%',
            borderRadius: '24px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-4px)' }
          }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <EmailIcon sx={{ fontSize: 30, color: '#000000ff', mr: 1 }} />
            <Typography variant="h5" fontWeight="bold">
              Customer Support
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" mb={3}>
            Need help? Reach out to us below and our team will respond shortly.
          </Typography>

          {submitted && (
            <Alert severity="success" sx={{ mb: 2 }}>
               Your message has been sent. We will contact you soon.
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Your Message"
              multiline
              rows={4}
              fullWidth
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px'
                }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
              disabled={!query.trim()}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: '12px',
                fontWeight: '600',
                textTransform: 'none',
                fontSize: '1rem',
                backgroundColor: '#000000ff',
                '&:hover': {
                  backgroundColor: '#000000ff'
                }
              }}
            >
              Send Message
            </Button>
          </form>

          <Typography
            variant="body2"
            color="text.secondary"
            mt={3}
            textAlign="center"
          >
            Or email us at: <strong>support@shop-top.com</strong>
          </Typography>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default CustomerSupport;
