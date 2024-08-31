/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef } from 'react';
import { UploadIcon } from '@radix-ui/react-icons';

import { Input } from '../../../components/ui/input';

interface GridCellProps {
  handleDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  row: any;
  userId?: string;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  modal?: boolean;
  handleCellClick?: () => void;
}

const GridCell = forwardRef<GridCellProps, any>(
  (
    {
      row,
      userId,
      handleFileChange,
      handleDescriptionChange,
      handleCellClick,
      modal = false,
    },
    _
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (modal && userId) {
        e.stopPropagation();
        e.preventDefault();
        handleCellClick && handleCellClick();
      }
    };

    return (
      <div
        onClick={handleClick}
        className='grid-item h-[210px] cursor-pointer flex flex-col bg-slate-100'
      >
        <div className='flex justify-center items-center min-h-[160px] h-[160px] relative text-center flex-1'>
          {row.image && (
            <img
              src={row.image}
              alt='image'
              className='w-full h-full object-cover'
            />
          )}
          {!userId && (
            <>
              <Input
                onChange={handleFileChange}
                type='file'
                accept='image/*'
                className='block h-full p-0 w-full absolute inset-0  opacity-0 cursor-pointer'
              />
              {row.image ? null : <UploadIcon width={25} height={25} />}
            </>
          )}
        </div>
        <Input
          disabled={!!userId}
          value={row?.title || ''}
          onChange={handleDescriptionChange}
          type='text'
          placeholder='Description'
          className='border-none outline-none focus-visible:ring-0 shadow-none input-field
      h-[40px] disabled:opacity-100 disabled:cursor-default'
        />
      </div>
    );
  }
);

export default GridCell;
