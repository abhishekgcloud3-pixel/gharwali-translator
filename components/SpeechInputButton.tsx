import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Mic, MicOff, XCircle, Copy, Trash2, Check } from 'lucide-react';
import { useSpeechRecognition } from '@/lib/hooks/useSpeechRecognition';
import MicAnimation from './MicAnimation';
import { Badge } from './ui/badge';

interface SpeechInputButtonProps {
  onTranscriptChange: (text: string) => void;
  language?: string;
  className?: string;
}

const SpeechInputButton: React.FC<SpeechInputButtonProps> = ({
  onTranscriptChange,
  language = 'hi-IN',
  className
}) => {
  const {
    isListening,
    fullTranscript,
    confidence,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported
  } = useSpeechRecognition();

  const [copied, setCopied] = useState(false);
  const [lastProcessedTranscript, setLastProcessedTranscript] = useState('');

  // When a final transcript is available (or when we stop listening), we send it up
  useEffect(() => {
    if (fullTranscript && !isListening && fullTranscript !== lastProcessedTranscript) {
      onTranscriptChange(fullTranscript);
      setLastProcessedTranscript(fullTranscript);
    }
  }, [isListening, fullTranscript, lastProcessedTranscript, onTranscriptChange]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      setLastProcessedTranscript('');
      resetTranscript();
      startListening(language);
    }
  };

  const handleCopy = () => {
    if (fullTranscript) {
      navigator.clipboard.writeText(fullTranscript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isSupported) {
    return (
      <div className={className}>
        <Badge variant="outline" className="text-muted-foreground flex items-center gap-1 opacity-60">
          <XCircle size={12} />
          <span className="text-[10px]">Speech Not Supported</span>
        </Badge>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={isListening ? "destructive" : "outline"}
          size="sm"
          onClick={handleToggleListening}
          aria-label={isListening ? "Stop recording" : "Start recording"}
          className={`h-9 gap-2 px-3 transition-all duration-300 ${isListening ? 'ring-2 ring-red-500 ring-offset-1' : ''}`}
        >
          {isListening ? (
            <>
              <MicOff size={16} className="animate-pulse" />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Mic size={16} />
              <span>Speak</span>
            </>
          )}
        </Button>
        
        {isListening && <MicAnimation />}
        
        {!isListening && fullTranscript && (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopy}
              title="Copy transcript"
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={resetTranscript}
              title="Clear transcript"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        )}

        {isListening && confidence > 0 && (
          <Badge variant="secondary" className="text-[10px] h-5">
            {(confidence * 100).toFixed(0)}% confident
          </Badge>
        )}

        {error && (
          <Badge variant="destructive" className="text-[10px] h-5 max-w-[200px] truncate">
            {error}
          </Badge>
        )}
      </div>
      
      {fullTranscript && (
        <div className={`p-2 bg-muted/50 rounded-md text-sm italic text-muted-foreground border border-dashed border-primary/30 transition-all duration-300 animate-in fade-in slide-in-from-top-1 ${!isListening ? 'opacity-70' : ''}`}>
          <div className="flex items-start gap-2">
            {isListening ? (
              <span className="mt-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
            ) : (
              <Check size={12} className="mt-1 text-green-500 flex-shrink-0" />
            )}
            <p className="line-clamp-2">{fullTranscript}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechInputButton;
