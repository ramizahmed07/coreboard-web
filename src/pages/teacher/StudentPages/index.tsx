/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import PageContainer from '../../../components/PageContainer';
import useFetchStudent from './use-fetch-student';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Component1Icon, UploadIcon } from '@radix-ui/react-icons';
import { httpClient } from '../../../lib/httpClient';
import useFetchBoard from './use-fetch-board';
import { Loader } from '../../../components/Loader';

const board: any = [
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
];

export default function StudentPages() {
  const [isSaving, setIsSaving] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { data, isFetching } = useFetchStudent(id as string);
  const boardResponse: any = useFetchBoard(id as string);
  const { student } = data || {};
  const [pages, setPages] = useState<any>([board]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (boardResponse.data?.board?.pages?.length) {
      setPages(boardResponse?.data?.board.pages);
    }
  }, [boardResponse.data]);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res: { message: string; imageUrl: string } =
          await httpClient.post('/upload', {
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
              'x-authorization': localStorage.getItem('access_token'),
            },
          });
        const newPages = [...pages];
        newPages[selected][index] = {
          ...newPages[selected][index],
          image: res?.imageUrl,
        };
        setPages(newPages);
      } catch (err) {
        console.error('Error uploading file', err);
        toast.error('Error uploading file');
      }
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await httpClient.post('/create-board', {
        data: JSON.stringify({ pages, studentId: student?._id }),
        headers: {
          'Content-Type': 'application/json',
          'x-authorization': localStorage.getItem('access_token'),
        },
      });
    } catch (error) {
      toast.error('Error saving the board');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isFetching && !student) return <Navigate to='/not-found' />;

  if (isFetching || boardResponse.isFetching)
    return (
      <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center'>
        <Component1Icon className='h-10 w-10 animate-spin' />
      </div>
    );
  return (
    <PageContainer>
      <div className='flex items-center justify-between'>
        <Button variant='secondary'>User - {student?.username}</Button>
        <Button onClick={handleSave}>
          {isSaving && <Component1Icon className='mr-2 animate-spin' />} Save
        </Button>
      </div>

      <section className='mt-4'>
        <div className='space-x-3 mb-4'>
          {pages?.map((_: any, idx: number) => (
            <Button
              key={idx}
              onClick={() => {
                setSelected(idx);
              }}
              variant={idx === selected ? 'default' : 'secondary'}
            >
              Page {idx + 1}
            </Button>
          ))}
          <Button
            onClick={() => {
              setPages([...pages, board]);
              setSelected(pages.length);
            }}
            className='rounded-full'
            variant='secondary'
          >
            +
          </Button>
        </div>
        <div className='grid grid-cols-5 gap-2'>
          {pages[selected]?.map((row: any, idx: number) => (
            <div
              className='shadow-md border p-2 rounded-md h-[300px] flex flex-col'
              key={idx}
            >
              <div className='flex justify-center items-center h-[230px] relative bg-slate-100 text-center flex-1 mb-2'>
                {row.image && (
                  <img
                    src={row.image}
                    alt='image'
                    className='w-full h-full object-cover'
                  />
                )}
                <Input
                  onChange={(e) => handleFileChange(e, idx)}
                  type='file'
                  accept='image/*'
                  className='block h-full w-full absolute inset-0 opacity-0 cursor-pointer'
                />
                {row.image ? null : <UploadIcon width={25} height={25} />}
              </div>
              <Input
                value={row?.title || ''}
                onChange={(e) => {
                  const newPages = [...pages];
                  newPages[selected][idx] = {
                    ...newPages[selected][idx],
                    title: e.target.value,
                  };
                  setPages(newPages);
                }}
                type='text'
                placeholder='Description'
                className='h-full max-h-[40px]'
              />
            </div>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
