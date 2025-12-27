import { useState } from 'react';
import { useAuth } from './useAuth';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) return;
    // login expects LoginRequest object or separate args?
    // In AuthContext I defined login: (credentials: LoginRequest) => Promise<void>;
    // In AuthService I defined login(credentials: LoginRequest)
    // Let's check AuthContext definition again.
    await login({ email, password });
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    isLoading,
    error,
  };
};
