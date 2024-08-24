import { Navigate, useParams, rout, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import useResetPassword from './api/use-reset-password';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { useAuth } from '../../contexts/auth';
import { Component1Icon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export default function ResetPassword() {
  const { isAuthenticated } = useAuth();
  const { token } = useParams();
  const navigate = useNavigate();
  const { isPending, mutateAsync } = useResetPassword();
  const [password, setPassword] = useState('');

  const isBtnDisabled = !password;

  if (isAuthenticated) return <Navigate to={'/'} replace />;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (isBtnDisabled) return;

      const response = (await mutateAsync({
        token: token || '',
        password,
      })) as string;
      if (response.includes('expired')) throw response;
      toast.success(response);
      navigate('/signin');
    } catch (error) {
      toast.error(error as any);
      console.log(error);
    }
  };

  return (
    <div>
      <AuthLayout>
        <div className='space-y-2'>
          <Component1Icon className='mx-auto h-6 w-6' />
          <h1 className='text-2xl font-semibold tracking-tight'>
            Reset your password
          </h1>
          <p className='text-sm text-muted-foreground'>
            Enter your new password
          </p>
        </div>

        <form onSubmit={handleSubmit} className='grid gap-2 w-full'>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name='password'
            type='password'
            placeholder='Password...'
          />
          <Button type='submit' disabled={isBtnDisabled} className='w-full'>
            {isPending && <Component1Icon className='mr-2 animate-spin' />}
            Submit
          </Button>
        </form>
      </AuthLayout>
    </div>
  );
}
