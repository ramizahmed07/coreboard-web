import { useState } from 'react';

import Modal from '../Modal';
import useFetchStudents from '../../api/use-fetch-students';
import { Button } from '../ui/button';
import { arePagesEmpty } from '../../utils/arePagesEmpty';
import { Loader } from '../Loader';
import useCreateBoard from '../../api/use-create-board';
import { Component1Icon } from '@radix-ui/react-icons';

export default function AssignToStudents({ pages }: any) {
  const { isPending, mutateAsync } = useCreateBoard();
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading } = useFetchStudents();
  const { students } = data || {};

  return (
    <Modal
      open={isModalOpen}
      setOpen={setIsModalOpen}
      description='Assign board to students'
      title='Assign to students'
      trigger={
        <Button
          disabled={arePagesEmpty(pages)}
          onClick={() => setIsModalOpen(true)}
        >
          Assign To Students
        </Button>
      }
    >
      <div>{isLoading && <Loader className='h-6 w-6' />}</div>
      <div className='max-h-[500px] overflow-y-auto flex flex-col items-center justify-between w-full'>
        <div className='flex items-center pb-2 mb-2 border-border border-b  justify-between w-full'>
          <label className='text-lg inline-block flex-1' htmlFor='all'>
            All
          </label>
          <input
            className='ml-2 w-4 h-4'
            checked={studentIds.length === students?.length}
            type='checkbox'
            onChange={(e) => {
              if (e.target.checked) {
                setStudentIds(students?.map((student) => student._id) || []);
              } else {
                setStudentIds([]);
              }
            }}
            id='all'
          />
        </div>

        {students?.map((student) => (
          <div
            className='flex items-center justify-between w-full'
            key={student._id}
          >
            <label
              className='text-lg inline-block flex-1'
              htmlFor={student._id}
            >
              {student.username}
            </label>
            <input
              className='ml-2 w-4 h-4'
              checked={studentIds.includes(student._id)}
              type='checkbox'
              onChange={(e) => {
                if (e.target.checked) {
                  setStudentIds([...studentIds, student._id]);
                } else {
                  setStudentIds(studentIds.filter((id) => id !== student._id));
                }
              }}
              id={student._id}
            />
          </div>
        ))}
      </div>
      <Button
        onClick={async () => {
          await mutateAsync({ pages, studentIds, isAppend: true });
          setIsModalOpen(false);
          setStudentIds([]);
        }}
        className='w-full mt-4'
      >
        {isPending && <Component1Icon className='mr-2 animate-spin' />} Assign
      </Button>
    </Modal>
  );
}
