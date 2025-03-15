'use client';

import { Container, Typography, Box } from '@mui/material';
import Navbar from '../../components/layout/Navbar';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import ClaimsList from '../../components/claims/ClaimsList';

export default function InsurerDashboard() {
  return (
    <ProtectedRoute allowedRoles={['insurer']}>
      <Navbar />
      <Container className="container">
        <Typography variant="h4" component="h1" className="page-title">
          Insurer Dashboard
        </Typography>

        <Box sx={{ mt: 3 }}>
          <ClaimsList />
        </Box>
      </Container>
    </ProtectedRoute>
  );
}