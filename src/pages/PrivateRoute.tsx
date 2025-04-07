import { Navigate } from 'react-router';
import { useAuthCheck } from '@/hooks/useAuthCheck'; // Adjust path as needed

interface PrivateRouteProps {
  element: React.ComponentType;
  allowedDepartments: string[];
}

const PrivateRoute = ({ element: Element, allowedDepartments }: PrivateRouteProps) => {
  const { isAuthenticated, department, isLoading } = useAuthCheck();

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!department || allowedDepartments.length > 0 && !allowedDepartments.includes(department)) {
    return <Navigate to="/" replace />; // Redirect to home if department is not allowed
  }

  return <Element />;
};

export default PrivateRoute;
