import { Component1Icon, Pencil1Icon } from '@radix-ui/react-icons';

import Modal from '../Modal';
import useUpdateStudent from './use-update-student';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useState } from 'react';
import { User } from '../../contexts/auth';

export default function UpdateStudent({ user }: { user: User }) {
  const { isPending, mutateAsync } = useUpdateStudent();
  const [isUpdateStudentModalOpen, setIsUpdateStudentModalOpen] =
    useState(false);
  const [data, setData] = useState({ username: user.username, password: '' });
  const { username, password } = data;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Modal
      open={isUpdateStudentModalOpen}
      setOpen={setIsUpdateStudentModalOpen}
      description='Update the student'
      title='Update Student'
      trigger={
        <Button
          onClick={() => setIsUpdateStudentModalOpen(true)}
          variant='secondary'
        >
          <Pencil1Icon />
        </Button>
      }
    >
      <div className='grid gap-3'>
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
        <Button
          onClick={async () => {
            await mutateAsync({ ...data, _id: user._id });
            setIsUpdateStudentModalOpen(false);
          }}
          className='w-full'
        >
          {isPending && <Component1Icon className='mr-2 animate-spin' />}
          Update
        </Button>
      </div>
    </Modal>
  );
}
