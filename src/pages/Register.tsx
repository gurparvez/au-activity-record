import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
