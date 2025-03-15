'use client';

import { useEffect } from 'react';
import { Box, Typography, Button, Container, Grid, Paper, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push(user.role === 'patient' ? '/patient-dashboard' : '/insurer-dashboard');
    }
  }, [isAuthenticated, user?.role, router]);

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: 'center',
            py: 10,
            px: 4,
            background: '#EBE8DB',
            borderRadius: 4,
            boxShadow: 8,
            color: '#B03052',
            border: '1px solid black'
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
            Insurance Claims Portal
          </Typography>
          <Typography variant="h6" color="inherit" gutterBottom sx={{ opacity: 0.8 }}>
            Secure and intuitive platform for managing your claims.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => router.push('/login')}
            sx={{ mt: 3, px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold', backgroundColor: '#B03052', color: '#fff', '&:hover': { backgroundColor: '#902040' } }}
          >
            Login to your account
          </Button>
        </Box>

        {/* Info Cards */}
        <Grid container spacing={4} sx={{ mt: 6 }}>
          {[
            {
              title: 'For Patients',
              description:
                'Easily submit claims, track their status, and access all details in one place.',
            },
            {
              title: 'For Insurers',
              description:
                'Review and manage submitted claims efficiently with full control.',
            },
            {
              title: 'Secure & Easy',
              description:
                'Data privacy and security ensured with a user-friendly interface.',
            },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={8}
                sx={{
                  p: 5,
                  height: '100%',
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  backgroundColor: '#EBE8DB',
                  color: '#B03052',
                  border: '1px solid black',
                  '&:hover': {
                    boxShadow: 12,
                    backgroundColor: '#E0E0E0',
                    color: '#000',
                  },
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight={600} color="inherit">
                  {item.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {item.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}