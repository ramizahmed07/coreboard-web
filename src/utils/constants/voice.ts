const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export const DEFAULT_VOICE = {
  lang: 'en-US',
  name: 'Samantha',
  voiceURI: isSafari ? 'com.apple.voice.compact.en-US.Samantha' : 'Samantha',
};
