import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Create axios instance with defaults
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set auth header whenever token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Fetch user data
  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (error) {
      console.error('FETCH USER ERROR:', error.response?.data || error.message);
      // Only clear auth on 401 (unauthorized)
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Check auth on mount and when token changes
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);

    return userData;
  };

  // Registration no longer logs the user in directly — the account is created
  // unverified, and a verification email is sent. We just return the server's
  // response (message + email) so the UI can show a "check your inbox" screen.
  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  };

  // Called when the user lands on /verify-email?token=...&email=... after
  // clicking the link in their inbox. On success the server returns a JWT,
  // just like login does, so we log them straight in.
  const verifyEmail = async (token, email) => {
    const res = await api.post('/auth/verify-email', { token, email });
    const { token: newToken, user: newUser } = res.data;

    if (newToken && newUser) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
    }

    return res.data;
  };

  // Lets a user request a fresh verification email if the first one
  // expired or never arrived.
  const resendVerification = async (email) => {
    const res = await api.post('/auth/resend-verification', { email });
    return res.data;
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  }, []);

  // Merge partial updates (e.g. from PUT /auth/profile) into the current user
  // object without needing a full refetch. Falls back to replacing user
  // entirely if there's no existing user to merge into.
  const updateUser = useCallback((updates) => {
    setUser(prev => (prev ? { ...prev, ...updates } : updates));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, verifyEmail, resendVerification, logout, loading, api, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);