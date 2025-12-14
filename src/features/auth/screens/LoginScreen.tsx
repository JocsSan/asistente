import React from 'react';
import { LoginLayout } from '../components/LoginLayout';
import { LoginForm } from '../components/LoginForm';

export const LoginScreen = () => {
  return (
    <LoginLayout 
      title="Welcome Back"
      subtitle="Sign in to continue to your assistant"
    >
      <LoginForm />
    </LoginLayout>
  );
};
