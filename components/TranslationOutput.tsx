import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CopyButton } from './CopyButton';
import { useMemo } from 'react';

export interface TranslationOutputProps {
  title: string;
  language: string;
  translation: string;
  isLoading: boolean;
  showCopyButton?: boolean;
  className?: string;
}

export const TranslationOutput = ({ 
  title, 
  language, 
  translation, 
  isLoading, 
  showCopyButton = true, 
  className = ''
}: TranslationOutputProps) => {
  
  // Format translation with highlighted untranslated words
  const formattedTranslation = useMemo(() => {
    if (!translation) return translation;
    
    // Split by untranslated words and create React elements
    const parts = translation.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className="untranslated-word">
            {part}
          </span>
        );
      }
      return part;
    });
  }, [translation]);

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {language}
          </Badge>
          <span>{title}</span>
        </CardTitle>
        {showCopyButton && (
          <CopyButton 
            textToCopy={translation} 
            ariaLabel={`Copy ${language} translation`}
          />
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="min-h-[100px] h-full flex items-center justify-center">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Translating...</span>
            </div>
          ) : translation ? (
            <div className="w-full h-full p-2 border rounded-md bg-background text-sm whitespace-pre-wrap break-words translation-output">
              {formattedTranslation}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Translation will appear here
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};