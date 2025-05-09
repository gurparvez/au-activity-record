import { useEffect, useState } from 'react';
import { account, myAppwrite } from '@/api/appwrite';

export const useAuthCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userDepartment, setUserDepartment] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await account.get();

        if (!user.$id) {
          setError('No user found!');
        } else {
          const userDepartment = await myAppwrite.getUserDepartment(user.$id);
          setUserId(user.$id);
          setUserName(user.name);
          setUserEmail(user.email);
          if (userDepartment) setUserDepartment(userDepartment.name);
          setIsAuthenticated(true);
        }

        const userRole = await myAppwrite.getUserRole(user.$id);
        if (!userRole) {
          const allDepartments = await myAppwrite.getAllDepartments();
          setDepartments(allDepartments);
          setIsLoading(false);
          return;
        }

        setRole(userRole.role);
        setIsApproved(userRole.isApproved);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return {
    isAuthenticated,
    userId,
    userName,
    userEmail,
    userDepartment,
    role,
    isApproved,
    error,
    departments,
    isLoading,
  };
};
