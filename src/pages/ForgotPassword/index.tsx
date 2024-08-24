import { useState } from 'react';
import { Component1Icon } from '@radix-ui/react-icons';

import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import useSendEmail from './api/use-send-email';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export default function ForgotPassword() {
  const { isAuthenticated } = useAuth();
  const { isPending, mutateAsync } = useSendEmail();
  const [email, setEmail] = useState('');
  const isBtnDisabled = !email || !validateEmail(email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (isBtnDisabled) return;
      const response: string = (await mutateAsync({
        username: email,
      })) as string;
      if (response.includes('not found')) throw response;
      toast.success(response);
    } catch (error) {
      toast.error(error as any);
      console.log(error);
    }
  };

  if (isAuthenticated) return <Navigate to={'/'} replace />;

  return (
    <AuthLayout>
      <div className='space-y-2'>
        <Component1Icon className='mx-auto h-6 w-6' />
        <h1 className='text-2xl font-semibold tracking-tight'>
          Forgot your password?
        </h1>
        <p className='text-sm text-muted-foreground'>
          Enter your email to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className='grid gap-2 w-full'>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name='Email'
          type='email'
          placeholder='Email...'
        />
        <Button type='submit' disabled={isBtnDisabled} className='w-full'>
          {isPending && <Component1Icon className='mr-2 animate-spin' />}
          Submit
        </Button>
      </form>
    </AuthLayout>
  );
}
