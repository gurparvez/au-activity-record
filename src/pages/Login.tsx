import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Login = () => {
  const [backendError, setBackendError] = useState<string | null>(null);

  const { register, handleSubmit } = useForm();

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
              type="text"
              {...register('auid', { required: 'AUID is required' })}
              placeholder="AUID"
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
