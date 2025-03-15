'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid
} from '@mui/material';
import { getClaims } from '../../services/claimService';
import ClaimCard from './ClaimCard';
import { useAuth } from '../../hooks/useAuth';
import './ClaimsList.css';

export default function ClaimsList({ refreshTrigger }) {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });

  useEffect(() => {
    fetchClaims();
  }, [refreshTrigger, user, filters]);

  const fetchClaims = async () => {
    setLoading(true);
    setError('');

    try {
      const apiFilters = {};

      if (filters.status !== 'all') {
        apiFilters.status = filters.status;
      }

      if (user?.role === 'patient') {
        apiFilters.patientId = user.id;
      }

      const claimsData = await getClaims(apiFilters);

      let filteredClaims = claimsData;

      // Apply status filter
      if (filters.status !== 'all') {
        filteredClaims = filteredClaims.filter(claim => claim.status === filters.status);
      }

      // Apply search filter
      if (filters.search) {
        filteredClaims = filteredClaims.filter(claim =>
          claim.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          claim.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          claim.email.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setClaims(filteredClaims);
    } catch (err) {
      setError('Failed to load claims');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  if (loading && claims.length === 0) {
    return (
      <Box className="claims-list-loading">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="claims-list-container" sx={{
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '800px',
      width: '100%',
      mx: 'auto',
    }}>
      <Box className="claims-list-header">
        <Typography variant="h6" component="h2">
          {user?.role === 'insurer' ? 'All Claims' : 'Your Claims'}
        </Typography>

        <Grid container spacing={2} className="claims-list-filters">
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                name="status"
                value={filters.status}
                label="Status"
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={8}>
            <TextField
              fullWidth
              label="Search"
              name="search"
              value={filters.search}
              onChange={handleSearch}
              size="small"
              placeholder="Search by description, name or email"
            />
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" className="claims-list-error">
          {error}
        </Alert>
      )}

      {!loading && claims.length === 0 ? (
        <Alert severity="info" className="claims-list-empty">
          No claims found. {user?.role === 'patient' ? 'Submit a new claim to get started.' : ''}
        </Alert>
      ) : (
        <Box className="claims-list">
          {claims.map(claim => (
            <ClaimCard
              key={claim._id}
              claim={claim}
              onStatusUpdate={fetchClaims}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
