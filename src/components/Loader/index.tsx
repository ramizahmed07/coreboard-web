import { Component1Icon } from '@radix-ui/react-icons';
import { IconProps } from '@radix-ui/react-icons/dist/types';
import { cn } from '../../lib/utils';

export const Loader = ({ className }: IconProps) => {
  return (
    <div className='grid h-full w-full place-items-center'>
      <Component1Icon className={cn('h-12 w-12 animate-spin', className)} />
    </div>
  );
};
