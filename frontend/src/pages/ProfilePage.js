// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Avatar, Divider,
  TextField, Button, IconButton, Alert, Dialog, DialogActions,
  DialogContent, DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import MainLayout from '../components/MainLayout';

const ProfilePage = () => {
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const fetchProfile = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/user/profile', {
      headers: { Authorization: token }
    });
    setUser(res.data);
    setName(res.data.name);
    setEmail(res.data.email);
    setAvatar(res.data.avatar);
  } catch (err) {
    console.error('Profile fetch error:', err.response?.data || err.message);
    setError("Failed to fetch profile");
  }
};


  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: token }
      });
      setUser(res.data);
      setName(res.data.name);
      setEmail(res.data.email);
      setAvatar(res.data.avatar);
    } catch (err) {
      setError("Failed to fetch profile");
    }
  };

  fetchProfile();
}, [token]);


  const handleSave = async () => {
    try {
      const res = await axios.put('http://localhost:5000/api/user/profile', {
        name, email, avatar
      }, {
        headers: { Authorization: token }
      });
      setMessage(res.data.msg);
      setEditing(false);
      fetchProfile();
    } catch (err) {
      setError("Update failed.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handlePasswordChange = async () => {
    try {
      await axios.put('http://localhost:5000/api/user/change-password', {
        oldPassword, newPassword
      }, {
        headers: { Authorization: token }
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
        headers: { Authorization: token }
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
      <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
        <Avatar
          src={avatar}
          sx={{ width: 100, height: 100, mx: 'auto', mb: 2, fontSize: 40 }}
        >
          {!avatar && name?.charAt(0).toUpperCase()}
        </Avatar>
        <IconButton color="primary" component="label">
          <PhotoCamera fontSize="small" />
          <input type="file" hidden accept="image/*" onChange={handleImageChange} />
        </IconButton>

        <TextField
          label="Name"
          value={name}
          disabled={!editing}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={email}
          disabled={!editing}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />

        <Box mt={2}>
          {editing ? (
            <Button variant="contained" color="success" startIcon={<SaveIcon />} onClick={handleSave}>
              Save
            </Button>
          ) : (
            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setEditing(true)}>
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
        <Button variant="outlined" onClick={() => setOpenPasswordDialog(true)}>
          Change Password
        </Button>
        <Button variant="outlined" color="error" startIcon={<DeleteIcon />} sx={{ ml: 2 }} onClick={handleDeleteAccount}>
          Delete My Account
        </Button>
      </Paper>

      {/* 🔐 Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
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
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange}>Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
    </MainLayout>
  );
};

export default ProfilePage;