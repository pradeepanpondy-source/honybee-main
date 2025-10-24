import { useAuth } from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSkeleton from './LoadingSkeleton';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Check if this is a testing access (from URL parameter or localStorage)
  const urlHasTesting = location.search.includes('testing=true');
  const storedTesting = localStorage.getItem('testingMode') === 'true';
  const isTesting = urlHasTesting || storedTesting;

  // Store testing mode in localStorage if URL parameter is present
  if (urlHasTesting && !storedTesting) {
    localStorage.setItem('testingMode', 'true');
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!user && !isTesting) {
    return <Navigate to="/login" replace />;
  }

  // Allow testing access without Google sign-in
  if (isTesting) {
    return children;
  }

  // Check if user is signed in with Google
  if (user && !user.providerData.some(provider => provider.providerId === 'google.com')) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
