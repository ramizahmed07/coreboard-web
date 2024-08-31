import { PauseIcon, PlayIcon } from '@radix-ui/react-icons';

import { Button } from '../../../components/ui/button';
import { useAuth } from '../../../contexts/auth';
import { useSpeech, useVoices } from 'react-text-to-speech';
import { DEFAULT_VOICE } from '../../../utils/constants/voice';

export default function DetailedGridCell({
  row,
}: {
  row: { title?: string; image?: string };
}) {
  const { user } = useAuth();
  const { voices } = useVoices();

  const voice =
    voices.find(
      (voice) =>
        user?.voice?.name?.includes(voice.name) &&
        voice.lang === user?.voice?.lang
    ) || DEFAULT_VOICE;

  const { Text, speechStatus, start, pause } = useSpeech({
    text: row?.title || '',
    pitch: 1,
    rate: 1,
    volume: 1,
    lang: voice?.lang,
    voiceURI: voice.name,
    highlightText: true,
  });

  const handleToggleVoice = () => {
    if (speechStatus === 'started') pause();
    else start();
  };

  return (
    <div>
      <div className='bg-gray-100 h-[350px] w-full'>
        {row.image ? (
          <img
            src={row.image}
            alt='image'
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='flex justify-center items-center h-full'>
            <h2>No image found</h2>
          </div>
        )}
      </div>
      {row?.title && (
        <div className='mt-4 bg-gray-100 p-2 rounded-md'>
          <Button
            onClick={handleToggleVoice}
            size='sm'
            className='mr-2 p-0 w-7 h-7 rounded-full'
          >
            {speechStatus === 'started' ? <PauseIcon /> : <PlayIcon />}
          </Button>
          <Text />
        </div>
      )}
    </div>
  );
}
