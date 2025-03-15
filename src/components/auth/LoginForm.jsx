'use client';

import { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';

export default function LoginForm({ onSubmit, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('patient');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      await onSubmit(email, password, userType);
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <Paper elevation={3} className="login-form-container">
      <Typography variant="h5" component="h1" className="login-form-title">
        Login to Claims Portal
      </Typography>

      {error && <Alert severity="error" className="login-form-alert">{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} className="login-form">
        <FormControl fullWidth margin="normal">
          <InputLabel id="user-type-label">I am a</InputLabel>
          <Select
            labelId="user-type-label"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <MenuItem value="patient">Patient</MenuItem>
            <MenuItem value="insurer">Insurance Agent</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Email Address"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={loading}
          className="login-form-button"
        >
          {loading ? <CircularProgress size={24} /> : 'Login'}
        </Button>
      </Box>
    </Paper>
  );
}
