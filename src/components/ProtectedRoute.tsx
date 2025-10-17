import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import LoadingSkeleton from './LoadingSkeleton';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is signed in with Google
  if (!user.providerData.some(provider => provider.providerId === 'google.com')) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
