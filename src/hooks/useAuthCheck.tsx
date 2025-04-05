import { useEffect, useState } from 'react';
import { account, myAppwrite } from '@/api/appwrite';

export const useAuthCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id);
        setIsAuthenticated(true);

        const deptId = await myAppwrite.getUserDepartmentId(user.$id);
        if (!deptId) {
          const allDepartments = await myAppwrite.getAllDepartments();
          setDepartments(allDepartments);
          setIsLoading(false);
          return;
        }

        const dept = await myAppwrite.getDepartment(deptId);
        setDepartment(dept?.name);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, userId, department, error, departments, isLoading };
};