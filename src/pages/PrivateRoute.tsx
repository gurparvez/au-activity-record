import { Navigate } from 'react-router';
import { useAuthCheck } from '@/hooks/useAuthCheck'; // Adjust path as needed

interface PrivateRouteProps {
  element: React.ComponentType;
  allowedRoles: string[];
}

const PrivateRoute = ({ element: Element, allowedRoles }: PrivateRouteProps) => {
  const { isAuthenticated, role, isLoading } = useAuthCheck();

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!role || allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />; // Redirect to home if department is not allowed
  }

  return <Element />;
};

export default PrivateRoute;
