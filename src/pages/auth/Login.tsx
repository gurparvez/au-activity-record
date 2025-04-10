import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { myAppwrite } from '@/api/appwrite';
import { useTheme } from '@/components/theme-provider';
import { NavLink, useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login = () => {
  const [backendError, setBackendError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const themeContext = useTheme();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      setLoading(true);
      setBackendError(null);
      console.log('Login form submitted', data);
      await myAppwrite.loginUser(data.email, data.password);
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        setBackendError(error.message);
      } else {
        setBackendError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-96 p-6 shadow-lg">
        <CardContent>
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              type="email"
              {...register('email', { required: 'Email is required' })}
              placeholder="Email"
              className="w-full"
            />
            <Input
              type="password"
              {...register('password', { required: 'Password is required' })}
              placeholder="Password"
              className="w-full"
            />

            {backendError && (
              <p className="text-red-500 text-sm text-center mb-2">{backendError}</p>
            )}

            {loading ? (
              <Button className="w-full bg-gray-600" disabled>
                Login
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Login
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
          <Button onClick={myAppwrite.loginWithGoogle} variant="secondary" className="w-full">
            Sign in with Google
          </Button>
          <p className="text-center text-sm mt-4">
            Don't have an account?{' '}
            <NavLink to="/register" className="text-blue-400 hover:underline">
              Register here
            </NavLink>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
