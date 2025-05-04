import { Navigate, useParams } from 'react-router';
import { useAuthCheck } from '@/hooks/useAuthCheck'; // Adjust path as needed

interface PrivateRouteProps {
  element: React.ComponentType;
  allowedRoles: string[];
}

const PrivateRoute = ({ element: Element, allowedRoles }: PrivateRouteProps) => {
  const { isAuthenticated, role, userDepartment, isLoading } = useAuthCheck();
  const { dept } = useParams<{ dept: string }>(); // Extract :dept from URL

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!role || (allowedRoles.length > 0 && !allowedRoles.includes(role))) {
    return <Navigate to="/" replace />; // Redirect to home if role is not allowed
  }

  // For HOD role, ensure the department in the URL matches the user's department
  if (role === 'HOD' && dept && dept.toLowerCase() !== userDepartment.toLowerCase()) {
    return <Navigate to={`/team/hod/${userDepartment}`} replace />;
  }

  return <Element />;
};

export default PrivateRoute;