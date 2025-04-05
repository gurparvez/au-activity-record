import { myAppwrite } from '@/api/appwrite';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

const UpdateVerification = () => {
  const [searchParams] = useSearchParams(); // Get query params from URL
  const navigate = useNavigate();

  useEffect(() => {
    const userId = searchParams.get('userId');
    const secret = searchParams.get('secret');

    if (userId && secret) {
      // Automatically verify the email when the params are present
      verifyEmail(userId, secret);
    }
  }, [searchParams]);

  const verifyEmail = async (userId: string, secret: string) => {
    try {
      await myAppwrite.updateUserEmailVerification(userId, secret);
      console.log('Email verified successfully!');
      navigate('/');
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  return <div>UpdateVerification</div>;
};

export default UpdateVerification;
