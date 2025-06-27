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
    // Simulate sending query (in a real app, use backend/email)
    console.log("Support message:", { from: user.email, message: query });
    setSubmitted(true);
    setQuery('');
  };

  return (
    <MainLayout>
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 2 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          <EmailIcon fontSize="large" sx={{ verticalAlign: 'middle', mr: 1 }} />
          Customer Support
        </Typography>

        <Typography color="text.secondary" mb={2}>
          Need help? Reach out to us below and our team will respond shortly.
        </Typography>

        {submitted && (
          <Alert severity="success" sx={{ mb: 2 }}>
            ✅ Your message has been sent. We will contact you soon.
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
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            disabled={!query.trim()}
            sx={{ px: 3, py: 1, fontWeight: 600 }}
          >
            Send Message
          </Button>
        </form>

        <Typography variant="body2" color="text.secondary" mt={3}>
          Or email us at: <strong>support@shop-top.com</strong>
        </Typography>
      </Paper>
    </Box>
    </MainLayout>
  );
};

export default CustomerSupport;
