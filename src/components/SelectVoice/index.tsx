import { useSpeech } from 'react-text-to-speech';
import { CheckIcon, PlayIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface SelectVoiceProps {
  options: { language: string; voices: { name: string; voiceURI: string }[] }[];
  value?: { lang: string; name: string };
  onChange: (voice: { lang: string; name: string }) => void;
}

const INITIAL_SELECTED_VOICE = {
  lang: '',
  name: '',
  voiceURI: '',
};

export function SelectVoice({
  options = [],
  value,
  onChange,
}: SelectVoiceProps) {
  const [open, setOpen] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(INITIAL_SELECTED_VOICE);
  const { start, stop, pause } = useSpeech({
    text:
      `Hello my name is ${selectedVoice.name} and This is a test sentence` ||
      '',
    pitch: 1,
    rate: 1,
    volume: 1,
    lang: selectedVoice?.lang,
    voiceURI: selectedVoice.voiceURI,
    highlightText: true,
  });

  useEffect(() => {
    if (selectedVoice.name !== '') {
      start();
    }
    () => {
      pause();
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVoice]);

  const playTestSentence = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    voice: { lang: string; name: string; voiceURI: string }
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedVoice(voice);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger onClick={() => setOpen(true)} asChild>
        <Button variant='outline'>{value?.name || 'Select Voice'}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 h-[400px] overflow-y-auto'>
        <DropdownMenuLabel>Languages</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {options.map((option) => (
            <DropdownMenuSub key={option?.language}>
              <DropdownMenuSubTrigger
                className={cn({
                  'bg-slate-100': value?.lang === option.language,
                })}
              >
                {option?.language}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className='max-h-[300px] overflow-y-auto'>
                  <DropdownMenuLabel>Persons</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {option?.voices?.map((voice, i) => (
                    <DropdownMenuSub key={i}>
                      <DropdownMenuSubTrigger
                        className={cn({
                          'bg-slate-100': value?.name === voice.name,
                        })}
                      >
                        {voice.name}
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className='max-h-[300px] overflow-y-auto'>
                          <DropdownMenuItem
                            className='flex items-center '
                            onClick={(e) => {
                              stop();
                              playTestSentence(e, {
                                lang: option.language,
                                ...voice,
                              });
                            }}
                          >
                            <PlayIcon className='h-4 w-4 mr-2' /> Play Sample
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              onChange({
                                lang: option.language,
                                name: voice.name,
                              });
                            }}
                            className='flex items-center'
                          >
                            <CheckIcon className='h-4 w-4 mr-2' /> Select Voice
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
