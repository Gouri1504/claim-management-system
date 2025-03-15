'use client';

import { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  InputAdornment
} from '@mui/material';
import { AttachFile, Close } from '@mui/icons-material';
import { submitClaim } from '../../services/claimService';
import { useAuth } from '../../hooks/useAuth';

export default function ClaimForm({ onClaimSubmitted }) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    claimAmount: '',
    description: ''
  });

  const [file, setFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFile((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFile((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.claimAmount || !formData.description) {
      setError('Please fill all required fields');
      return;
    }

    if (isNaN(formData.claimAmount) || Number(formData.claimAmount) <= 0) {
      setError('Please enter a valid claimAmount');
      return;
    }

    setLoading(true);

    try {
      const claimData = {
        ...formData,
        claimAmount: Number(formData.claimAmount),
        patientId: user?.id,
        file
      };

      await submitClaim(claimData);
      setSuccess(true);
      setFormData({ name: user?.name || '', email: user?.email || '', claimAmount: '', description: '' });
      setFile([]);

      if (onClaimSubmitted) {
        onClaimSubmitted();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit claim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ width: '100%', minWidth: 500, margin: 'auto', padding: '24px', backgroundColor: '#FFFFFF' }}>
      <Typography variant="h6" fontWeight="600" color="#B03052" sx={{ marginBottom: '16px' }}>
        Submit New Claim
      </Typography>

      {error && <Alert severity="error" sx={{ marginBottom: '16px' }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal" required disabled={loading} />
        <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" required disabled={loading} />
        <TextField label="Claim Amount" name="claimAmount" type="number" value={formData.claimAmount} onChange={handleChange} fullWidth margin="normal" required InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} disabled={loading} />
        <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth margin="normal" required multiline rows={4} disabled={loading} />

        <Box sx={{ mt: 2, mb: 2 }}>
          <Button variant="outlined" component="label" startIcon={<AttachFile />} disabled={loading}>
            Upload Documents
            <input type="file" multiple hidden onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
          </Button>

          {file.map((file, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', marginTop: '8px' }}>
              <Typography variant="body2" noWrap>{file.name}</Typography>
              <IconButton size="small" onClick={() => removeFile(index)} disabled={loading}><Close fontSize="small" /></IconButton>
            </Box>
          ))}
        </Box>

        <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ marginTop: '16px' }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Claim'}
        </Button>
      </Box>

      <Snackbar open={success} autoHideDuration={5000} message="Claim submitted successfully!" />
    </Paper>
  );
}
