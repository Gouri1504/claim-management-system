import axios from 'axios';
import jwtDecode from 'jwt-decode';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Mock users for development
const MOCK_USERS = [
  { id: '1', email: 'patient@example.com', password: 'password', name: 'John Doe', role: 'patient' },
  { id: '2', email: 'insurer@example.com', password: 'password', name: 'Jane Smith', role: 'insurer' }
];

export const login = async (email, password) => {
  // For development, use mock users
  if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Create a mock token
    const token = btoa(JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: Date.now() + 3600000 // 1 hour expiration
    }));

    localStorage.setItem('auth_token', token);
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  // For production, use actual API
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    const { token } = response.data;
    console.log("token");
    localStorage.setItem('auth_token', auth_token);
    return getUserFromToken();
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logout = () => {
  localStorage.removeItem('auth_token');
};

export const getUserFromToken = () => {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;

  try {
    if (process.env.NODE_ENV === 'development') {
      // For mock token
      return JSON.parse(atob(token));
    } else {
      // For real JWT token
      return jwtDecode(token);
    }
  } catch (error) {
    console.error('Token parse error:', error);
    localStorage.removeItem('auth_token');
    return null;
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};