import { useState, useEffect, useCallback, useRef } from 'react';
import { getSpeechRecognition, getSpeechErrorMessage } from '../utils/speech';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let currentFinalTranscript = '';
        let latestConfidence = 0;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            currentFinalTranscript += transcriptPart;
            latestConfidence = event.results[i][0].confidence;
          } else {
            interimTranscript += transcriptPart;
          }
        }

        if (currentFinalTranscript) {
          setTranscript(prev => prev + currentFinalTranscript);
        }
        
        // Use a temporary state or combined state for the full current view
        setInterimTranscript(interimTranscript);

        if (latestConfidence > 0) {
          setConfidence(latestConfidence);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        setError(getSpeechErrorMessage(event));
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback((lang = 'hi-IN') => {
    setError(null);
    if (!recognitionRef.current) {
      setError('Speech recognition not supported in this browser.');
      return;
    }

    recognitionRef.current.lang = lang;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err: any) {
      if (err.name === 'InvalidStateError') {
        // Recognition already started
      } else {
        setError('Failed to start speech recognition');
        setIsListening(false);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setConfidence(0);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    fullTranscript: transcript + (interimTranscript ? ' ' + interimTranscript : ''),
    confidence,
    error,
    startListening,
    stopListening,
    resetTranscript,
    setLanguage: (lang: string) => {
      if (recognitionRef.current) {
        recognitionRef.current.lang = lang;
      }
    },
    isSupported: !!getSpeechRecognition()
  };
};
