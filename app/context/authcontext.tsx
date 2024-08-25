import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, logoutUser, fetchWithTokenRefresh, fetchUserData } from '../utils/authUtils';

interface User {
  email: string;
  username: string;
  // Añade aquí cualquier otra propiedad que tu usuario pueda tener
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
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await fetchUserData();
        setUser(userData);
      } catch (error) {
        console.error('Error checking user login status:', error);
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const tokens = await loginUser(email, password);
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      
      // Fetch user data after successful login
      const userData = await fetchUserData();
      setUser(userData);
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials.');
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
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