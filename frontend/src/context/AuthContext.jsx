import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ig_token') || null);
  const [loading, setLoading] = useState(true);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [demoAccount, setDemoAccount] = useState(null);

  // Initialize session and check backend health
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check health / Supabase status
        const health = await authService.getHealth().catch(() => null);
        if (health) {
          setSupabaseConnected(health.supabaseConnected);
          if (health.demoAccount) setDemoAccount(health.demoAccount);
        }

        const storedToken = localStorage.getItem('ig_token');
        if (storedToken) {
          const res = await authService.getMe();
          if (res && res.user) {
            setUser(res.user);
          } else {
            localStorage.removeItem('ig_token');
            setToken(null);
          }
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err.message);
        localStorage.removeItem('ig_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (identifier, password) => {
    const data = await authService.login(identifier, password);
    if (data.token && data.user) {
      localStorage.setItem('ig_token', data.token);
      setToken(data.token);
      setUser(data.user);
      if (data.source === 'supabase') {
        setSupabaseConnected(true);
      }
      return data;
    }
    throw new Error(data.message || 'Login failed');
  };

  const signup = async (userData) => {
    const data = await authService.signup(userData);
    if (data.token && data.user) {
      localStorage.setItem('ig_token', data.token);
      setToken(data.token);
      setUser(data.user);
      if (data.source === 'supabase') {
        setSupabaseConnected(true);
      }
      return data;
    }
    throw new Error(data.message || 'Signup failed');
  };

  const logout = () => {
    localStorage.removeItem('ig_token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    supabaseConnected,
    demoAccount,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
