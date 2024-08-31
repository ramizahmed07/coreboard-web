import { Component1Icon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useVoices } from 'react-text-to-speech';
import { toast } from 'sonner';
import { AxiosResponse } from 'axios';

import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth, User } from '../../contexts/auth';
import { emailRegex } from '../../utils/constants/validationTokens';
import { httpClient } from '../../lib/httpClient';
import { DEFAULT_VOICE } from '../../utils/constants/voice';

export default function Signup() {
  const { voices } = useVoices();
  const { dispatch } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: '',
    password: '',
    role: 'teacher',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { username, password } = data;

  const isBtnDisabled = !username || !password || isLoading;

  const voice =
    voices.find((voice) => voice.name === DEFAULT_VOICE.name) || DEFAULT_VOICE;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (isBtnDisabled) return;
      setIsLoading(true);
      const isValidEmail = emailRegex.test(username);

      if (!isValidEmail) {
        // if email not valid, show error and don't proceed
        toast.error('Email Address', {
          description: 'Please enter a valid email address',
        });
        return;
      }

      if (!password) {
        return toast.error('Password', {
          description: 'Please enter a valid password',
        });
      }

      const payload = {
        ...data,
        voice: { lang: voice?.lang, name: voice?.name },
      };
      const response = await httpClient.post<AxiosResponse<{ user: User }>>(
        '/signup',
        {
          data: JSON.stringify(payload),
          includeHeaders: true,
        }
      );
      const token = response.headers['x-authorization'] as string;
      localStorage.setItem('access_token', token);

      dispatch({
        type: 'RESOLVED',
        payload: (response.data as { user: User }).user,
      });

      navigate('/', {
        replace: true,
      });
    } catch (error) {
      toast.error('User already exists');
    } finally {
      setIsLoading(false);
    }
  };

  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return (
    <AuthLayout>
      <div className='text-center space-y-2'>
        <Component1Icon className='mx-auto h-6 w-6' />
        <h1 className='text-2xl font-semibold tracking-tight'>
          Create an account
        </h1>
        <p className='text-sm text-muted-foreground'>
          Enter your credentials to create your account
        </p>
      </div>

      <form onSubmit={handleSignup} className='grid gap-2 w-full'>
        <Input
          name='username'
          value={username}
          onChange={handleChange}
          type='email'
          placeholder='name@example.com'
        />
        <Input
          name='password'
          value={password}
          onChange={handleChange}
          type='password'
          placeholder='password'
        />
        <Button type='submit' disabled={isBtnDisabled} className='w-full'>
          {isLoading && <Component1Icon className='mr-2 animate-spin' />}
          Sign up
        </Button>
      </form>
      <Separator />
      <div>
        <Link to='/signin'>
          <Button
            variant='link'
            className='text-xs py-0 font-normal text-muted-foreground underline'
          >
            Already have an account? Sign In
          </Button>
        </Link>
      </div>
    </AuthLayout>
  );
}
