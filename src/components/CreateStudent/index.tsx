import { useState } from 'react';
import Modal from '../Modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import useCreateStudent from './use-create-student';
import { Component1Icon } from '@radix-ui/react-icons';

export default function CreateStudent() {
  const { isPending, mutateAsync } = useCreateStudent();
  const [isCreateStudentModalOpen, setIsCreateStudentModalOpen] =
    useState(false);
  const [data, setData] = useState({ username: '', password: '' });
  const { username, password } = data;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
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
            await mutateAsync(data);
            setIsCreateStudentModalOpen(false);
          }}
          className='w-full'
        >
          {isPending && <Component1Icon className='mr-2 animate-spin' />}
          Create
        </Button>
      </div>
    </Modal>
  );
}
