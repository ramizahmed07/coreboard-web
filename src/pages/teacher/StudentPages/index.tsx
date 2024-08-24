/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import useFetchBoard from './use-fetch-board';
import AssignToStudents from '../../../components/AssignToStudents';
import PageContainer from '../../../components/PageContainer';
import useFetchStudent from './use-fetch-student';
import useCreateBoard from '../../../api/use-create-board';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Component1Icon, Cross2Icon, UploadIcon } from '@radix-ui/react-icons';
import { httpClient } from '../../../lib/httpClient';
import { cn } from '../../../lib/utils';

const pageArr = [
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

const page: any = {
  name: 'Page',
  page: [...pageArr],
};

export default function StudentPages({ userId }: { userId?: string }) {
  const { id } = useParams<{ id: string }>();
  const { pathname } = useLocation();
  const { mutate, isPending } = useCreateBoard();
  const { data, isLoading } = useFetchStudent(
    (userId || id) as string,
    userId ? pathname + userId : pathname
  );
  const boardResponse: any = useFetchBoard(
    (userId || id) as string,
    userId ? pathname + userId : pathname
  );
  const { student } = data || {};
  const [pages, setPages] = useState<any>([{ ...page, page: [...pageArr] }]);
  const [selected, setSelected] = useState(0);
  const [editable, setEditable] = useState<number | null>(null);
  const isHome = pathname === '/';

  useEffect(() => {
    if (boardResponse.data?.board?.pages?.length) {
      setPages(boardResponse?.data?.board.pages);
    }
  }, [boardResponse.data]);

  const getBrowserVoice = (voices: any) => {
    const browserVoiceIndMap: any = {
      chrome: 3,
      firefox: 8,
    }
    let browser = ''
    if (navigator.userAgent.indexOf("Chrome") != -1) {
      browser = 'chrome'
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
      browser = 'safari'
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
      browser = 'firefox'
    }
    const ind = browserVoiceIndMap[browser]
    let voice
    if (ind && voices?.length && voices.length > ind && voices[ind]) {
      voice = voices[ind]
    }
    if (!voice) {
      voice = voices.find((v: any) => ['en-GB', 'en'].includes(v?.lang))
    }
    if (!voice) {
      voice = voices[0]
    }
    return voice
  }

  const speak = (description: string) => {
    const voices = speechSynthesis.getVoices()
    if (!voices.length) return
    const utterance = new SpeechSynthesisUtterance(description)
    const voice = getBrowserVoice(voices)
    utterance.voice = voice
    speechSynthesis.speak(utterance)
  }

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
        newPages[selected].page[index] = {
          ...newPages[selected].page[index],
          image: res?.imageUrl,
        };
        setPages(newPages);
      } catch (err) {
        console.error('Error uploading file', err);
        toast.error('Error uploading file');
      }
    }
  };

  if (isLoading || boardResponse.isLoading)
    return (
      <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center'>
        <Component1Icon className='h-10 w-10 animate-spin' />
      </div>
    );

  return (
    <PageContainer className='mt-4'>
      <div className='flex items-center justify-between'>
        {isHome ? (
          <div />
        ) : (
          <Button variant='secondary'>User - {student?.username}</Button>
        )}
        <div>
          {!userId &&
            (isHome ? (
              <AssignToStudents pages={pages} />
            ) : (
              <>
                <Button
                  onClick={() => {
                    mutate({ pages, studentIds: [student?._id as string] });
                  }}
                >
                  {isPending && (
                    <Component1Icon className='mr-2 animate-spin' />
                  )}{' '}
                  Save
                </Button>
              </>
            ))}
          {!userId && (
            <Button
              className='ml-2'
              onClick={() => {
                const newPages = [...pages];
                newPages[selected] = { ...page, page: [...pageArr] };
                setPages(newPages);
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <section className='mt-4'>
        <div className='space-x-2 md:space-x-3 mb-4 flex items-center'>
          <div className='space-x-2 md:space-x-3 flex items-center overflow-x-auto'>
            {pages?.map((page: any, idx: number) => (
              <Button
                key={idx}
                onDoubleClick={() => {
                  if (!userId) setEditable(idx);
                }}
                onClick={() => {
                  setSelected(idx);
                }}
                variant={idx === selected ? 'default' : 'secondary'}
                className='py-1 px-2 md:py-2 md:px-4 relative min-w-[80px] text-sm md:text-base md:min-w-[100px]'
              >
                {editable === idx ? (
                  <Input
                    onBlur={() => {
                      setEditable(null);
                      if (page.name === '') {
                        const newPages = [...pages];
                        newPages[idx] = { ...newPages[idx], name: 'Page' };
                        setPages(newPages);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === 'Escape') {
                        setEditable(null);
                        if (page.name === '') {
                          const newPages = [...pages];
                          newPages[idx] = { ...newPages[idx], name: 'Page' };
                          setPages(newPages);
                        }
                      }
                    }}
                    value={page.name}
                    onChange={(e) => {
                      const newPages = [...pages];
                      newPages[idx] = {
                        ...newPages[idx],
                        name: e.target.value,
                      };
                      setPages(newPages);
                    }}
                    type='text'
                    placeholder='Page name...'
                    className='outline-none ring-0 border-none focus-visible:ring-0 shadow-none input-field'
                  />
                ) : (
                  page.name
                )}

                {!userId && (
                  <div
                    onClick={() => {
                      if (pages.length > 1) {
                        const newPages = [...pages];
                        newPages.splice(idx, 1);
                        setPages(newPages);

                        if (idx + 1 === pages.length) {
                          setTimeout(() => {
                            setSelected(idx - 1);
                          }, 0);
                          return;
                        }
                        if (pages.length === 2) {
                          setTimeout(() => {
                            setSelected(0);
                          }, 0);
                        }
                      }
                    }}
                    className={cn(
                      'hover:bg-black bg-black text-white p-1 absolute top-0 right-0 rounded-md w-4 h-4 md:w-5 md:h-5',
                      {
                        'bg-white text-black hover:bg-white': idx === selected,
                      }
                    )}
                  >
                    <Cross2Icon className='w-3 h-3' />
                  </div>
                )}
              </Button>
            ))}
          </div>

          {!userId && (
            <Button
              onClick={() => {
                const newPage = { ...page, page: [...pageArr] };
                setPages([...pages, { ...newPage }]);
                setSelected(pages.length);
              }}
              className='rounded-full'
              variant='secondary'
            >
              +
            </Button>
          )}
        </div>
        <div className='grid grid-cols-3 md:grid-cols-5 bg-black gap-[1px] border-black border'>
          {pages[selected]?.page?.map((row: any, idx: number) => (
            <div
              className='grid-item h-[210px] flex flex-col bg-slate-100'
              key={idx}
              onClick={!userId ? undefined : () => {
                if (row?.title) {
                  speak(row.title)
                }
              }}
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
                      onChange={(e) => handleFileChange(e, idx)}
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
                onChange={(e) => {
                  const newPages = [...pages];
                  newPages[selected].page[idx] = {
                    ...newPages[selected].page[idx],
                    title: e.target.value,
                  };
                  setPages(newPages);
                }}
                type='text'
                placeholder='Description'
                className='border-none outline-none focus-visible:ring-0 shadow-none input-field
                  h-[40px] disabled:opacity-100 disabled:cursor-default'
              />
            </div>
          ))}
          <div className='bg-slate-100 block md:hidden'></div>
        </div>
      </section>
    </PageContainer>
  );
}
