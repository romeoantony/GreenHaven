import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" />;
};

export const AdminRoute = ({ children }) => {
  const { user, token } = useAuthStore();
  
  if (!token) return <Navigate to="/login" />;
  
  // Check if user has Admin role
  // roles can be a string (single role) or array (multiple roles)
  const isAdmin = Array.isArray(user?.roles) 
    ? user.roles.includes('Admin')
    : user?.roles === 'Admin';

  return isAdmin ? children : <Navigate to="/" replace />;
};

export const PublicOnlyRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? <Navigate to="/" replace /> : children;
};
