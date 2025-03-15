'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleHome = () => {
    if (!user) {
      router.push('/');
      return;
    }
    if (user.role === 'patient') {
      router.push('/patient-dashboard');
    } else if (user.role === 'insurer') {
      router.push('/insurer-dashboard');
    }
  };

  return (
    <AppBar position="fixed" sx={{ background: '#EBE8DB', boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)', borderBottom: '1px solid black' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ cursor: 'pointer', fontWeight: 'bold', color: '#B03052', flexGrow: 1 }}
          onClick={handleHome}
        >
          Insurance Claims Portal
        </Typography>
        {isAuthenticated && (
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1" sx={{ color: '#B03052', fontWeight: 500 }}>
              Welcome, {user?.name || 'User'}
            </Typography>
            <Button
              sx={{ color: '#B03052', '&:hover': { color: '#902040' } }}
              onClick={handleHome}
              startIcon={<HomeIcon />}
            >
              Dashboard
            </Button>
            <Button
              sx={{ color: '#B03052', '&:hover': { color: '#902040' } }}
              onClick={logout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
