import React, { createContext, useState, useEffect } from 'react';
import { loginUser, signupUser, logout, getToken, normalizeToken } from '../features/auth/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Check if token exists on mount
  useEffect(() => {
    const savedToken = getToken();
    
    if (savedToken) {
      setToken(savedToken);
      // Optionally decode JWT to get user info
      try {
        const tokenParts = normalizeToken(savedToken).split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        setUser(payload);
      } catch (err) {
        console.error('Invalid token:', err);
        logout();
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const token = await loginUser(credentials);
      setToken(token);
      const tokenParts = normalizeToken(token).split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      setUser(payload);
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  const signup = async (credentials) => {
    try {
      const response = await signupUser(credentials);
      return response;
    } catch (err) {
      console.error('Signup failed:', err);
      throw err;
    }
  };

  const handleLogout = () => {
    logout();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, signup, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
