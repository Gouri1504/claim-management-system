'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { CircularProgress } from '@mui/material';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        console.info('Redirecting to /login because user is not authenticated');
        router.push('/login');
      } else if (user) {
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          console.info(
            `User role (${user.role}) is not allowed. Allowed roles: [${allowedRoles.join(', ')}]`
          );
          if (user.role === 'patient' && router.pathname !== '/patient-dashboard') {
            console.info('Redirecting to /patient-dashboard');
            router.push('/patient-dashboard');
          } else if (user.role === 'insurer' && router.pathname !== '/insurer-dashboard') {
            console.info('Redirecting to /insurer-dashboard');
            router.push('/insurer-dashboard');
          } else {
            console.info('Redirecting to /login due to invalid role');
            router.push('/login');
          }
        }
      }
    }
  }, [loading, isAuthenticated, user, router, allowedRoles]);

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  if (!isAuthenticated || (allowedRoles.length > 0 && !allowedRoles.includes(user?.role))) {
    console.info('Not rendering children because user is not authenticated or role is invalid');
    return null;
  }

  console.info(`User is authenticated with role: ${user?.role}`);
  return children;
}
