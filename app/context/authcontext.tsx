import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getCSRFToken } from '../utils/getCSRFToken';

interface User {
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const csrfToken = getCSRFToken();    
        console.log(csrfToken);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
          withCredentials: true, 
        });
        if (response.status === 200) {
          console.log('User logged in');
          setUser(response.data.user);
          console.log(user);
        } else if (response.status === 403) {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking if user is logged in:', error);
        router.push('/');
        setUser(null);
      } finally {
        console.log(user);
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setUser(response.data.user);
        console.log('Login successful:', response.data);
        router.push('/dashboard');
      } else {
        console.error('Error:', response.data.error);
        setUser(null);
      }
    } catch (error) {
      console.error('Network Error:', error);
      setUser(null);
    }
  };
  const logout = async () => {
    const csrfToken = getCSRFToken();    
    console.log(csrfToken);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`,
        {},
        {
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setUser(null);
        router.push('');
      } else {
        console.error('Error during logout:', response.data.error);
      }
    } catch (error) {
      console.error('Network Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
