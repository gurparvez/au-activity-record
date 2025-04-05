import { Navigate } from 'react-router';
import { useAuthCheck } from '@/hooks/useAuthCheck'; // Adjust path as needed

interface PrivateRouteProps {
  element: React.ComponentType;
  allowedDepartment: string;
}

const PrivateRoute = ({ element: Element, allowedDepartment }: PrivateRouteProps) => {
  const { isAuthenticated, department, isLoading } = useAuthCheck();

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedDepartment && department !== allowedDepartment) {
    return <Navigate to="/" replace />; // Redirect to home if department doesn't match
  }

  return <Element />;
};

export default PrivateRoute;
