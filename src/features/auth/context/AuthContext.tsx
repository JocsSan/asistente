import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthResponse, LoginRequest } from '../api/types';
import { authService } from '../api/authService';

type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: AuthStatus;
  user: AuthResponse['user'] | null;
  token: string | null;
  error: Error | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    status: 'idle',
    user: null,
    token: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await authService.checkSession();
      if (session) {
        setState(prev => ({
          ...prev,
          status: 'authenticated',
          user: session.user,
          token: session.token,
          isLoading: false,
        }));
      } else {
        setState(prev => ({ ...prev, status: 'unauthenticated', isLoading: false }));
      }
    } catch (error) {
      setState(prev => ({ ...prev, status: 'unauthenticated', isLoading: false }));
    }
  };

  const login = async (credentials: LoginRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.login(credentials);
      setState(prev => ({
        ...prev,
        status: 'authenticated',
        user: response.user,
        token: response.token,
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        status: 'unauthenticated',
        error: error,
        isLoading: false,
      }));
      throw error;
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await authService.logout();
      setState(prev => ({
        ...prev,
        status: 'unauthenticated',
        user: null,
        token: null,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Logout failed', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
