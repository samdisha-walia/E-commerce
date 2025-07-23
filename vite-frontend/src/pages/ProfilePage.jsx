// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Divider, TextField, Button, Alert,
  Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import MainLayout from '../components/MainLayout';

const ProfilePage = () => {
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setName(res.data.name);
      setEmail(res.data.email);
    } catch (err) {
      setError("Failed to fetch profile");
    }
  };

  useEffect(() => {
    if (!token) {
      localStorage.clear();
      window.location.href = '/login';
    } else {
      fetchProfile();
    }
  }, [token]);

  const handleSave = async () => {
    try {
      const res = await axios.put('http://localhost:5000/api/user/profile', { name, email }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.msg);
      setEditing(false);
      fetchProfile();
    } catch (err) {
      setError("Update failed.");
    }
  };

  const handlePasswordChange = async () => {
    try {
      await axios.put('http://localhost:5000/api/user/change-password', {
        oldPassword, newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Password updated.");
      setOpenPasswordDialog(false);
    } catch (err) {
      setError("Failed to update password.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete('http://localhost:5000/api/user/delete-account', {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.clear();
      window.location.href = '/register';
    } catch (err) {
      setError("Failed to delete account.");
    }
  };

  if (!user) return <Typography mt={10} textAlign="center">Loading...</Typography>;

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 2 }}>
        <Paper elevation={4} sx={{
          p: 4,
          borderRadius: 3,
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          transition: '0.3s ease-in-out',
        }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            👤 My Profile
          </Typography>

          <TextField
            label="Name"
            value={name}
            disabled={!editing}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ mt: 2 }}
          />
          <TextField
            label="Email"
            value={email}
            disabled={!editing}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />

          <Box mt={3}>
            {editing ? (
              <Button
                variant="contained"
                color="success"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{
                  px: 3, py: 1.3,
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '10px'
                }}
              >
                Save
              </Button>
            ) : (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditing(true)}
                sx={{
                  px: 3, py: 1.3,
                  fontWeight: 600,
                  borderRadius: '10px'
                }}
              >
                Edit Profile
              </Button>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography fontSize="0.9rem" color="text.secondary">
            Member since: {new Date(user.memberSince).toLocaleDateString()}
          </Typography>

          {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <Divider sx={{ my: 3 }} />

          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              variant="outlined"
              onClick={() => setOpenPasswordDialog(true)}
              sx={{ px: 3, py: 1, borderRadius: '10px' }}
            >
              Change Password
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{ px: 3, py: 1, borderRadius: '10px' }}
              onClick={handleDeleteAccount}
            >
              Delete My Account
            </Button>
          </Box>
        </Paper>

        {/* 🔐 Password Dialog */}
        <Dialog
          open={openPasswordDialog}
          onClose={() => setOpenPasswordDialog(false)}
          PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
        >
          <DialogTitle fontWeight={600}>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              label="Old Password"
              type="password"
              fullWidth
              margin="normal"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpenPasswordDialog(false)} sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button onClick={handlePasswordChange} variant="contained" sx={{ textTransform: 'none' }}>
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
};

export default ProfilePage;
