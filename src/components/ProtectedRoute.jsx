// ProtectedRoute wraps a route that requires authentication.
// If requireAdmin is true, also checks for the admin role.

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isLoggedIn, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Wait until auth state is restored from localStorage before deciding.
  if (loading) return null;

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
