import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { account } from '@/api/appwrite';
import { OAuthProvider } from 'appwrite';
import { useTheme } from '@/components/theme-provider';

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const themeContext = useTheme();

  const onSubmit = (data: any) => {
    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Register form submitted', data);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-96 p-6 shadow-lg">
        <CardContent>
          <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              type="text"
              placeholder="AUID"
              {...register('auid', { required: 'AUID is required' })}
              className="w-full"
            />
            {errors.auid && <p className="text-red-500 text-sm">{String(errors.auid.message)}</p>}

            <Input
              type="password"
              placeholder="Password"
              {...register('password', { required: 'Password is required' })}
              className="w-full"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{String(errors.password.message)}</p>
            )}

            <Input
              type="password"
              placeholder="Confirm Password"
              {...register('confirmPassword', { required: 'Please confirm your password' })}
              className="w-full"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{String(errors.confirmPassword.message)}</p>
            )}

            <Button type="submit" className="w-full">
              Register
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
            className="w-full"
          >
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
