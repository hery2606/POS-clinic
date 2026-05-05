import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/login-form';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/kasir');
    }
  }, [isAuthenticated, navigate]);

  return <LoginForm onSubmit={login} isLoading={isLoading} error={error} />;
};

export default LoginPage;
