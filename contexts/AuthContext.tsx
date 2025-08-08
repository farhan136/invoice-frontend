'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Define the shape of the context's value
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the provider component
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component that wraps the application to provide authentication state.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true to check token
  const router = useRouter();

  useEffect(() => {
    // Check for an auth token in localStorage when the component mounts
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false); // Finished checking
  }, []);

  /**
   * Sets the user as authenticated and stores the token.
   * @param token - The authentication token.
   */
  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    router.push('/invoices'); // Redirect to a protected page
  };

  /**
   * Logs the user out by removing the token and updating the state.
   */
  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    router.push('/login'); // Redirect to the login page
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use the AuthContext.
 * This makes it easier to access the context values in other components.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};