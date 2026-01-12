import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { myAppwrite } from '@/api/appwrite';
import { useTheme } from '@/components/theme-provider';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import { getErrorMessage } from '@/types';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const [backendError, setBackendError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm<RegisterFormData>();
  const themeContext = useTheme();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormData) => {
    setBackendError(null);
    setLoading(true);
    try {
      if (data.password !== data.confirmPassword) {
        throw Error('Passwords should match!');
      }

      await myAppwrite.registerUser(data.name, data.email, data.password);
      await myAppwrite.sendUserVerificationEmail();
      navigate('/verify');
    } catch (error) {
      console.error('Registration error:', error);
      setBackendError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-96 p-6 shadow-lg">
        <CardContent>
          <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              type="text"
              placeholder="Name"
              {...register('name', { required: 'Name is required' })}
              className="w-full"
            />
            <Input
              type="text"
              placeholder="Email"
              {...register('email', { required: 'Email is required' })}
              className="w-full"
            />
            <Input
              type="password"
              placeholder="Password"
              {...register('password', { required: 'Password is required' })}
              className="w-full"
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              {...register('confirmPassword', { required: 'Please confirm your password' })}
              className="w-full"
            />
            {loading ? (
              <Button className="w-full bg-gray-600" disabled>
                Register
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Register
              </Button>
            )}
          </form>
          <div className="flex flex-row items-center justify-evenly my-3">
            <div
              className="flex-1 border-t"
              style={{ borderColor: themeContext.theme === 'dark' ? 'white' : 'black' }}
            ></div>
            <span className="mx-3">OR</span>
            <div
              className="flex-1 border-t"
              style={{ borderColor: themeContext.theme === 'dark' ? 'white' : 'black' }}
            ></div>
          </div>

          {backendError && <p className="text-red-500 text-sm text-center mb-2">{backendError}</p>}

          <Button onClick={myAppwrite.loginWithGoogle} variant="secondary" className="w-full">
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
