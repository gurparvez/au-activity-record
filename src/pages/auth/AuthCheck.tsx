import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { account, myAppwrite } from '@/api/appwrite';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AuthCheck = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await account.get(); // Get user session
        setUserId(user.$id);
        const dept = await myAppwrite.getUserDepartment(user.$id); // Fetch user's department

        if (!dept || !dept.departmentId) {
          setIsLoadingDepartments(true);
          const allDepartments = await myAppwrite.getAllDepartments();
          console.log(allDepartments);

          setDepartments(allDepartments);
          setIsLoadingDepartments(false);
          return;
        }

        console.log('User department:', dept);
        
      } catch (error) {
        setIsLoadingDepartments(false);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      }
    };

    checkAuth();
  }, [navigate]);

  const handleDepartmentSelect = async () => {
    if (!selectedDept || !userId) return;
    try {
      await myAppwrite.registerUserDepartment(userId, selectedDept);
      window.location.reload(); // refresh after successful update
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update department.');
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => navigate('/login')} className="mt-4">
          Go to Login
        </Button>
      </div>
    );
  }

  if (departments.length > 0 || isLoadingDepartments) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl mb-4">Select Your Department</h2>
        <Select
          value={selectedDept ?? undefined} // Use undefined for no selection
          onValueChange={setSelectedDept} // shadcn Select uses onValueChange
          disabled={isLoadingDepartments}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {isLoadingDepartments ? (
              <SelectItem value="loading" disabled>
                Loading...
              </SelectItem>
            ) : (
              departments.map((dept) => (
                <SelectItem key={dept.$id} value={dept.$id}>
                  {dept.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <Button
          onClick={handleDepartmentSelect}
          className="mt-4"
          disabled={isLoadingDepartments}
        >
          Save
        </Button>
      </div>
    );
  }

  return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
};

export default AuthCheck;