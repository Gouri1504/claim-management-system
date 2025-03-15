import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const decodedUser = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        console.log('Decoded User:', decodedUser);
        setUser(decodedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = ({ token, role }) => {
    try {
      const decodedUser = JSON.parse(atob(token.split('.')[1]));
      console.log('Login User:', decodedUser);

      localStorage.setItem('auth_token', token);
      localStorage.setItem('role', role);

      setUser(decodedUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to decode token during login:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
