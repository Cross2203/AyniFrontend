import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

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

  const fetchWithCredentials = (url: string, options: RequestInit = {}) => {
    return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
      ...options,
      credentials: 'include',
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      },
    });
  };

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // Fetch CSRF token
        await fetchWithCredentials('/get_csrf_token');
        
        // Check user login status
        const response = await fetchWithCredentials('/user');
        if (!response.ok) {
          throw new Error('Error fetching user data');
        }
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Error checking user login status:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Fetch CSRF token before login
      await fetchWithCredentials('/get_csrf_token');

      const response = await fetchWithCredentials('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      setUser(data.user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials.');
    }
  };

  const logout = async () => {
    try {
      // Fetch CSRF token before logout
      await fetchWithCredentials('/get_csrf_token');

      const response = await fetchWithCredentials('/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

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