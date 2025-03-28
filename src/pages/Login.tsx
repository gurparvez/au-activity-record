import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { account } from '@/api/appwrite';
import { OAuthProvider } from 'appwrite';
import { useTheme } from '@/components/theme-provider';

const Login = () => {
  const [backendError, setBackendError] = useState<string | null>(null);

  const { register, handleSubmit } = useForm();
  const themeContext = useTheme();

  const onSubmit = async (data: any) => {
    try {
      setBackendError(null); // Clear any previous errors
      console.log('Login form submitted', data);
    } catch (error) {
      setBackendError('An unexpected error occurred. Please try again.');
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

            <Button type="submit" className="w-full">
              Login
            </Button>
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
          <Button
            onClick={() => {
              account.createOAuth2Session(
                OAuthProvider.Google, // provider
                'https://localhost:5173/', // redirect here on success
                'https://localhost:5173/', // redirect here on failure
                // ['repo', 'user'] // scopes (optional)
              );
            }}
            variant="secondary"
            className='w-full'
          >
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
