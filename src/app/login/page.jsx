'use client';

import { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, TextField, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../../components/layout/Navbar';

export default function LoginPage() {
  const { user, isAuthenticated, login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      router.push(user.role === 'patient' ? '/patient-dashboard' : '/insurer-dashboard');
    }
  }, [isAuthenticated, user?.role, router]);

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email,
        password,
      });

      const { token, role } = response.data;
      localStorage.setItem('auth_token', token);
      login({ token, role });

      router.push(role === 'patient' ? '/patient-dashboard' : '/insurer-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: '#FFFFFF',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
            mt: 8,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            color="#B03052"
            mb={2}
            sx={{ letterSpacing: '1px' }}
          >
            Welcome Back
          </Typography>

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <Typography color="error" mt={1} fontSize="14px">
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 3,
              padding: '12px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#FFFFFF',
              '&:hover': { backgroundColor: '#a02645' },
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
          </Button>
        </Box>
      </Container>
    </>
  );
}
