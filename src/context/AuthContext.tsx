import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  is_approved: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  axios.defaults.baseURL = API_BASE_URL;
  axios.defaults.headers.common['Content-Type'] = 'application/json';

  // Set up axios interceptor to handle token
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const response = await axios.get(API_ENDPOINTS.AUTH.PROFILE);
          const userData = response.data.user;
          setUser(userData);
          localStorage.setItem('userRole', userData.role);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password
      });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      setToken(token);
      setUser(user);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || 'An error occurred during login';
        
        // Handle specific error cases
        if (status === 403) {
          throw new Error(message); // Show the specific message for deactivated/pending accounts
        } else if (status === 401) {
          throw new Error('Invalid email or password');
        } else {
          throw new Error(message);
        }
      }
      console.error('Login error:', error);
      throw new Error('An error occurred during login');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, {
        username,
        email,
        password
      });
      
      // Return success message
      return response.data.message;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'An error occurred during registration';
        throw new Error(message);
      }
      console.error('Registration error:', error);
      throw new Error('An error occurred during registration');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        loading,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 