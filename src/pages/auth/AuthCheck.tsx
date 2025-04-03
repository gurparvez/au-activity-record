import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { account, myAppwrite } from '@/api/appwrite';
import { Button } from '@/components/ui/button';

const AuthCheck = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await account.get(); // Get user session
        const team = await myAppwrite.getUserTeam(user.$id); // Fetch user's team

        if (team) {
          navigate(`/team/${team.id}`); // Redirect to team page
        } else {
          setError('Access Denied!');
        }
      } catch (error) {
        setError('User not logged in. Please log in again.');
      }
    };

    checkAuth();
  }, [navigate]);

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

  return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
};

export default AuthCheck;
