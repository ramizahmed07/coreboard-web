import { useVoices } from 'react-text-to-speech';

export default function useFetchVoices() {
  const { languages, voices } = useVoices();
  let formattedArray = languages.map((language) => {
    return {
      language: language,
      voices: voices
        .filter((voice) => voice.lang === language)
        .map((voice) => ({ name: voice.name, voiceURI: voice.voiceURI }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    };
  });

  // Sort the formatted array by the language
  formattedArray = formattedArray.sort((a, b) =>
    a.language.localeCompare(b.language)
  );

  return { voices: formattedArray };
}
