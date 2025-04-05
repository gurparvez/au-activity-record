import { useNavigate } from 'react-router';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { myAppwrite } from '@/api/appwrite';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';

const AuthCheck = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userId, department, error, departments, isLoading } = useAuthCheck();
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && department) {
      if (department === 'iqac') {
        navigate('/team/iqac');
      } else {
        navigate('/team/hod');
      }
    }
  }, [isAuthenticated, department, navigate]);

  const handleDepartmentSelect = async () => {
    if (!selectedDept || !userId) return;
    try {
      await myAppwrite.registerUserDepartment(userId, selectedDept);
      window.location.reload(); // Refresh to trigger recheck
    } catch (err) {
      console.error('Failed to update department:', err);
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

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (departments.length > 0 && !department) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl mb-4">Select Your Department</h2>
        <Select
          value={selectedDept ?? undefined}
          onValueChange={setSelectedDept}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept.$id} value={dept.$id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleDepartmentSelect} className="mt-4" disabled={isLoading}>
          Save
        </Button>
      </div>
    );
  }

  return null; // Return null if navigating
};

export default AuthCheck;