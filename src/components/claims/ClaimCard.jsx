'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  AttachFile,
  CalendarMonth,
  Description,
  Person,
  Email,
  AttachMoney,
} from '@mui/icons-material';
import { updateClaimStatus } from '../../services/claimService';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/api';
import { motion } from 'framer-motion';

export default function ClaimCard({ claim, onStatusUpdate, viewOnly = false }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    approvedAmount: claim.approvedAmount || claim.claimAmount,
    insurerComments: claim.insurerComments || '',
  });

  const isInsurer = user?.role === 'insurer';

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateStatus = async (status) => {
    setLoading(true);
    try {
      await updateClaimStatus(claim._id, {
        status,
        approvedAmount: status === 'approved' ? Number(formData.approvedAmount) : 0,
        insurerComments: formData.insurerComments,
      });
      onStatusUpdate();
      handleClose();
    } catch (error) {
      console.error('Failed to update claim status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = async () => {
    if (!claim.documentUrl) return;
    setDownloading(true);

    try {
      const response = await api.get(claim.documentUrl, {
        responseType: 'blob', // Binary response
      });

      console.log(response);

      // Extract filename from URL or set a default one
      const urlParts = claim.documentUrl.split('/');
      const filename = urlParts[urlParts.length - 1] || 'document.pdf';

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download document:', error);
    } finally {
      setDownloading(false);
    }
  };


  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            backgroundColor: '#F9FAFC',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            minWidth: '700px',
            width: '100%',
            mx: 'auto',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': { transform: 'scale(1.02)' },
          }}
        >
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                ${claim.claimAmount.toLocaleString()}
              </Typography>
              <Chip label={claim.status.toUpperCase()} color={getStatusColor(claim.status)} size="small" />
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <CalendarMonth fontSize="small" /> {formatDate(claim.submissionDate)}
            </Typography>

            <Typography variant="body1" sx={{ mt: 1, color: '#555' }}>{claim.description}</Typography>

            {claim.documentUrl && (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AttachFile />}
                  onClick={handleDownloadDocument}
                  disabled={downloading}
                >
                  {downloading ? <CircularProgress size={20} /> : 'View Document'}
                </Button>
              </Box>
            )}

            {claim.status.toLowerCase() === 'approved' && (
              <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
                Approved Amount: ${claim.approvedAmount ? claim.approvedAmount.toLocaleString() : 'N/A'}
              </Typography>
            )}

            {claim.insurerComments && (
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: '#666' }}>
                <strong>Comments:</strong> {claim.insurerComments}
              </Typography>
            )}

            {isInsurer && !viewOnly && claim.status.toLowerCase() === 'pending' && (
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" size="small" onClick={handleOpen}>
                  Review Claim
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Review Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Review Claim</DialogTitle>
        <DialogContent>
          <TextField
            label="Approved Amount"
            name="approvedAmount"
            type="number"
            value={formData.approvedAmount}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
          />
          <TextField
            label="Insurer Comments"
            name="insurerComments"
            value={formData.insurerComments}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button onClick={() => handleUpdateStatus('rejected')} color="error" disabled={loading}>Reject</Button>
          <Button onClick={() => handleUpdateStatus('approved')} color="success" disabled={loading}>Approve</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
