import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('study_buddy_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('study_buddy_token');
      const storedUser = localStorage.getItem('study_buddy_user');

      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        // Verify session freshness
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success && res.data?.data) {
            setUser(res.data.data);
            localStorage.setItem('study_buddy_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.warn('Session check failed, logging out:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.success && res.data?.data) {
      const authData = res.data.data;
      const userInfo = {
        id: authData.id,
        email: authData.email,
        name: authData.name,
        role: authData.role,
      };
      setToken(authData.token);
      setUser(userInfo);
      localStorage.setItem('study_buddy_token', authData.token);
      localStorage.setItem('study_buddy_user', JSON.stringify(userInfo));
      return userInfo;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data?.success && res.data?.data) {
      const authData = res.data.data;
      const userInfo = {
        id: authData.id,
        email: authData.email,
        name: authData.name,
        role: authData.role,
      };
      setToken(authData.token);
      setUser(userInfo);
      localStorage.setItem('study_buddy_token', authData.token);
      localStorage.setItem('study_buddy_user', JSON.stringify(userInfo));
      return userInfo;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('study_buddy_token');
    localStorage.removeItem('study_buddy_user');
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data?.success && res.data?.data) {
        setUser(res.data.data);
        localStorage.setItem('study_buddy_user', JSON.stringify(res.data.data));
      }
    } catch (err) {
      console.error('Error refreshing user details', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
