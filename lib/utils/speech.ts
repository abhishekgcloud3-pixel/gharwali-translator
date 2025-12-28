export const getSpeechRecognition = () => {
  if (typeof window !== 'undefined') {
    return (
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    );
  }
  return null;
};

export const isSpeechRecognitionSupported = () => {
  return !!getSpeechRecognition();
};

export interface SpeechRecognitionError {
  error: string;
  message: string;
}

export const getSpeechErrorMessage = (event: any): string => {
  switch (event.error) {
    case 'no-speech':
      return 'No speech was detected. Please try again.';
    case 'audio-capture':
      return 'No microphone was found. Ensure that a microphone is installed.';
    case 'not-allowed':
      return 'Permission to use microphone is blocked.';
    case 'network':
      return 'Network error occurred.';
    case 'aborted':
      return 'Speech recognition was aborted.';
    default:
      return `Error occurred in recognition: ${event.error}`;
  }
};
