import { useState } from 'react';
import { Component1Icon } from '@radix-ui/react-icons';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { toast } from 'sonner';
import { useAuth, User } from '../../contexts/auth';
import { httpClient } from '../../lib/httpClient';
import { AxiosResponse } from 'axios';

export default function Signin() {
  const { dispatch, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState({ username: '', password: '' });
  const { username, password } = data;
  const from = location.state?.from;
  const isBtnDisabled = !username || !password || isLoading;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSignin = async () => {
    try {
      setIsLoading(true);

      if (!username)
        return toast.error('Username or Email', {
          description: 'Please enter a valid username or email',
        });

      if (!password)
        return toast.error('Password', {
          description: 'Please enter a valid password',
        });

      const response = await httpClient.post<AxiosResponse<{ user: User }>>(
        '/login',
        {
          data: {
            username,
            password,
          },
          includeHeaders: true,
        }
      );

      const token = response.headers['x-authorization'] as string;
      localStorage.setItem('access_token', token);

      dispatch({
        type: 'RESOLVED',
        payload: (response.data as { user: User }).user,
      });

      navigate(from || '/', {
        replace: true,
      });
    } catch (error) {
      toast.error('Incorrect credentials');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) return <Navigate to={from || '/'} replace />;

  return (
    <AuthLayout>
      <div className='space-y-2'>
        <Component1Icon className='mx-auto h-6 w-6' />
        <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
        <p className='text-sm text-muted-foreground'>
          Enter your credentials to sign in to your account
        </p>
      </div>

      <div className='grid gap-2 w-full'>
        <Input
          value={username}
          onChange={handleChange}
          name='username'
          type='text'
          placeholder='username or email'
        />
        <Input
          value={password}
          onChange={handleChange}
          name='password'
          type='password'
          placeholder='password'
        />
        <Button
          onClick={handleSignin}
          disabled={isBtnDisabled}
          className='w-full'
        >
          {isLoading && <Component1Icon className='mr-2 animate-spin' />}
          Sign in
        </Button>
      </div>
      <Separator />

      <div className='flex flex-col'>
        {/* <Link to='/forgot-password'>
          <Button
            variant='link'
            className='py-0 text-xs font-normal text-muted-foreground underline'
          >
            {'Forgot Password?'}
          </Button>
        </Link> */}
        <Link to='/signup'>
          <Button
            variant='link'
            className='py-0 text-xs font-normal text-muted-foreground underline'
          >
            {"Don't have an account? Sign Up"}
          </Button>
        </Link>
      </div>
    </AuthLayout>
  );
}
