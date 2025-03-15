'use client';

import { useState } from 'react';
import { Container, Typography, Box, Paper, Tabs, Tab, Button, Divider } from '@mui/material';
import Navbar from '../../components/layout/Navbar';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import ClaimForm from '../../components/claims/ClaimForm';
import ClaimsList from '../../components/claims/ClaimsList';

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [refreshClaims, setRefreshClaims] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleClaimSubmitted = () => {
    setActiveTab(1);
    setRefreshClaims((prev) => prev + 1);
  };

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {/* Dashboard Title */}
        <Typography
          variant="h4"
          fontWeight={700}
          color="#B03052"
          sx={{ textAlign: 'center', mb: 3 }}
        >
          Patient Dashboard
        </Typography>

        {/* Tabs */}
        <Paper
          sx={{
            mb: 3,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '16px',
                textTransform: 'none',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#B03052',
              },
            }}
          >
            <Tab label="Submit New Claim" />
            <Tab label="Your Claims" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
<Box
  sx={{
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '800px', // Limits width
    width: '100%', // Ensures responsiveness
    mx: 'auto', // Centers it horizontally
  }}
>


          {activeTab === 0 ? (
            <>
              <ClaimForm onClaimSubmitted={handleClaimSubmitted} />
              <Divider sx={{ my: 3 }} />
            </>
          ) : (
            <>
              <Typography
                variant="h6"
                fontWeight={600}
                color="#B03052"
                sx={{ mb: 2 }}
              >
                Your Submitted Claims
              </Typography>
              <ClaimsList key={refreshClaims} refreshTrigger={refreshClaims} />
            </>
          )}
        </Box>
      </Container>
    </ProtectedRoute>
  );
}
