import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, logout, getUserFromToken } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const userData = getUserFromToken();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const userData = await login(email, password);
      setUser(userData);

      // Redirect based on user role
      if (userData.role === 'patient') {
        router.push('/patient-dashboard');
      } else if (userData.role === 'insurer') {
        router.push('/insurer-dashboard');
      }

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to login. Please check your credentials.'
      };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    loading,
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};