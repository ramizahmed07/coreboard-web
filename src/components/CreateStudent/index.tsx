import { useState } from 'react';
import { useVoices } from 'react-text-to-speech';
import Modal from '../Modal';
import useCreateStudent from './use-create-student';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Component1Icon } from '@radix-ui/react-icons';
import { DEFAULT_VOICE } from '../../utils/constants/voice';

const INITIAL_DATA = { username: '', password: '' };

export default function CreateStudent() {
  const { voices } = useVoices();
  const { isPending, mutateAsync } = useCreateStudent();
  const [isCreateStudentModalOpen, setIsCreateStudentModalOpen] =
    useState(false);
  const [data, setData] = useState(INITIAL_DATA);
  const { username, password } = data;

  const isBtnDisabled =
    data?.password === '' || data?.username === '' || isPending;

  const voice =
    voices.find((voice) => voice.name === DEFAULT_VOICE.name) || DEFAULT_VOICE;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (isBtnDisabled) return;

      await mutateAsync({
        ...data,
        voice: { lang: voice?.lang, name: voice?.name },
      });
      setIsCreateStudentModalOpen(false);
      setData(INITIAL_DATA);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      open={isCreateStudentModalOpen}
      setOpen={setIsCreateStudentModalOpen}
      description='Create a new student'
      title='Create Student'
      trigger={
        <Button
          onClick={() => setIsCreateStudentModalOpen(true)}
          variant='outline'
        >
          Create Student
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className='grid gap-3'>
        <Input
          onChange={handleChange}
          value={username}
          type='text'
          name='username'
          placeholder='username'
        />
        <Input
          onChange={handleChange}
          value={password}
          type='password'
          name='password'
          placeholder='password'
        />
        <Button disabled={isBtnDisabled} type='submit' className='w-full'>
          {isPending && <Component1Icon className='mr-2 animate-spin' />}
          Create
        </Button>
      </form>
    </Modal>
  );
}
