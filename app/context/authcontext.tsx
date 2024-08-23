import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/axiosConfig';
import axios from 'axios';

interface User {
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        await api.get('/get_csrf_token');
        console.log('CSRF token fetched successfully');
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    const checkUserLoggedIn = async () => {
      try {
        await fetchCSRFToken(); // Fetch CSRF token before checking login status
        console.log('Checking user login status...');
        const response = await api.get<{ user: User }>('/user');
        console.log('User login response:', response.data);
        setUser(response.data.user);
      } catch (error) {
        console.error('Error checking user login status:', error);
        if (axios.isAxiosError(error)) {
          console.log('Response status:', error.response?.status);
          console.log('Response data:', error.response?.data);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await api.get('/get_csrf_token'); // Fetch CSRF token before login
      console.log('Attempting login...');
      const response = await api.post<{ user: User }>('/login', { email, password });
      console.log('Login response:', response.data);
      setUser(response.data.user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error)) {
        console.log('Response status:', error.response?.status);
        console.log('Response data:', error.response?.data);
      }
      setError('Login failed. Please check your credentials.');
    }
  };

  const logout = async () => {
    try {
      await api.get('/get_csrf_token'); // Fetch CSRF token before logout
      console.log('Attempting logout...');
      await api.post('/logout');
      console.log('Logout successful');
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      if (axios.isAxiosError(error)) {
        console.log('Response status:', error.response?.status);
        console.log('Response data:', error.response?.data);
      }
      setError('Logout failed. Please try again.');
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    logout,
    error,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};