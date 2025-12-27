import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Check, Copy } from 'lucide-react';

export interface CopyButtonProps {
  textToCopy: string;
  ariaLabel?: string;
  className?: string;
}

export const CopyButton = ({ textToCopy, ariaLabel = 'Copy to clipboard', className }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <Button
      onClick={handleCopy}
      size="icon"
      variant="outline"
      aria-label={ariaLabel}
      className={className}
      disabled={!textToCopy || textToCopy.trim() === ''}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
};