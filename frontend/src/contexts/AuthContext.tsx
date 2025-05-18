import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as mockAuth from '../utils/mockAuthService';

// Define the API URL
const API_URL = 'http://localhost:8000/api/v1';

// Define types
interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      try {
        // Get current session from mock auth service
        const { user, token: sessionToken } = await mockAuth.getSession();
        
        if (sessionToken && user) {
          setToken(sessionToken);
          setUser(user);
          
          // Configure axios with token for API calls
          axios.defaults.headers.common['Authorization'] = `Bearer ${sessionToken}`;
        }
      } catch (error) {
        console.error('Session error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      console.log('Attempting login for user:', username);
      
      // Sign in with mock auth service
      const { user, token: accessToken } = await mockAuth.signIn(username, password);
      
      console.log('Login successful:', user);
      
      // Save token to state (localStorage is handled by mock auth service)
      setToken(accessToken);
      
      // Set user data
      setUser(user);
      
      // Configure axios with token for API calls
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Set loading to false before navigation
      setIsLoading(false);
      
      // Navigate to dashboard
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string, fullName?: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      console.log('Registering user with mock auth service:', { username, email, password, fullName });
      
      // Register with mock auth service
      const user = await mockAuth.signUp(email, password, username, fullName);
      
      console.log('Registration successful:', user);
      
      // Get the token from the mock auth service (it's already stored in localStorage)
      const { token: accessToken } = await mockAuth.getSession();
      
      if (accessToken) {
        setToken(accessToken);
        
        // Set user data
        setUser(user);
        
        // Configure axios with token for API calls
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        // Set loading to false before navigation
        setIsLoading(false);
        
        // Navigate to dashboard
        navigate('/');
      } else {
        // If no token was found, still set loading to false
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await mockAuth.signOut();
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  // Context value
  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
