import { Component1Icon, TrashIcon } from '@radix-ui/react-icons';
import { Button } from '../ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { useState } from 'react';
import useDeleteStudent from './use-delete-student';

export default function DeleteStudent({ userId }: { userId: string }) {
  const { isPending, mutateAsync } = useDeleteStudent();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleDelete = async () => {
    await mutateAsync({ _id: userId });
    setIsPopoverOpen(false);
  };

  return (
    <>
      <Popover open={isPopoverOpen}>
        <PopoverTrigger asChild>
          <Button onClick={() => setIsPopoverOpen(true)} variant='destructive'>
            <TrashIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <p className='text-sm'>
            Are you sure you want to delete this student?
          </p>
          <div className='mt-2'>
            <Button
              onClick={() => {
                setIsPopoverOpen(false);
              }}
              size='sm'
              variant='outline'
              className='mr-2'
            >
              Cancel
            </Button>
            <Button onClick={handleDelete} size='sm'>
              {isPending && <Component1Icon className='mr-2 animate-spin' />}
              Delete
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
