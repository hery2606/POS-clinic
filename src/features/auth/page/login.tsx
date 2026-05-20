import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/login-form';
import { useAuth } from '../hooks/useAuth';
import { getRoleRedirectPath } from '@/routes/routeConfig';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = getRoleRedirectPath(user.role);
      navigate(redirectPath);
    }
  }, [isAuthenticated, user, navigate]);

  return <LoginForm onSubmit={login} isLoading={isLoading} error={error} />;
};

export default LoginPage;
