import { useTranslation } from '@/lib/hooks/useTranslation';
import { TranslationOutput } from './TranslationOutput';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Swap, RefreshCw, Info } from 'lucide-react';
import { useRef } from 'react';
import SpeechInputButton from './SpeechInputButton';

export const TextTranslator = () => {
  const {
    inputText,
    setInputText,
    hindiTranslation,
    englishTranslation,
    isLoading,
    characterCount,
    wordCount,
    translationMetadata,
    swapped,
    handleInputChange,
    clearTranslations,
    swapLanguages,
    copyToClipboard
  } = useTranslation();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSpeechTranscript = (transcript: string) => {
    if (!textareaRef.current) {
      setInputText(prev => prev + (prev.length > 0 ? ' ' : '') + transcript);
      return;
    }

    const { selectionStart, selectionEnd } = textareaRef.current;
    const currentText = inputText;
    
    const prefix = currentText.substring(0, selectionStart);
    const suffix = currentText.substring(selectionEnd);
    
    const newText = 
      prefix + 
      (selectionStart > 0 && !prefix.endsWith(' ') ? ' ' : '') +
      transcript + 
      (!suffix.startsWith(' ') && suffix.length > 0 ? ' ' : '') +
      suffix;

    setInputText(newText);
    
    // Set focus back to textarea after a short delay to allow state update
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = selectionStart + transcript.length + (selectionStart > 0 && !prefix.endsWith(' ') ? 1 : 0);
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // Example translations for user guidance
  const examples = [
    'Namaste, mai thik chu',
    'Khaana khana hai',
    'Dhanyavaad, tumhara sahayata ke liye',
    'Garhwali bhasha sundar hai'
  ];

  const handleExampleClick = (example: string) => {
    handleInputChange({ target: { value: example } } as React.ChangeEvent<HTMLTextAreaElement>);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Garhwali Text Translator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Translate Garhwali text to Hindi and English in real-time. See untranslated words marked for clarity.
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Garhwali
                </Badge>
                <span>Enter Garhwali Text</span>
              </CardTitle>
              <SpeechInputButton 
                onTranscriptChange={handleSpeechTranscript}
                className="self-start sm:self-auto"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleInputChange}
                placeholder="Type or paste Garhwali text here..."
                className="min-h-[150px] text-lg font-medium"
                aria-label="Garhwali text input"
              />

              {/* Character and Word Count */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>Characters: {characterCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Words: {wordCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <span>
                    {translationMetadata.totalWords > 0 && (
                      `${translationMetadata.translatedWords}/${translationMetadata.totalWords} words translated (${Math.round(translationMetadata.translationRate * 100)}%)`
                    )}
                  </span>
                </div>
              </div>

              {/* Example Translations */}
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                {examples.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleExampleClick(example)}
                    className="text-xs whitespace-nowrap"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Translation Outputs */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {!swapped ? (
            <>
              <TranslationOutput
                title="Hindi Translation"
                language="Hindi"
                translation={hindiTranslation}
                isLoading={isLoading}
              />
              <TranslationOutput
                title="English Translation"
                language="English"
                translation={englishTranslation}
                isLoading={isLoading}
              />
            </>
          ) : (
            <>
              <TranslationOutput
                title="English Translation"
                language="English"
                translation={englishTranslation}
                isLoading={isLoading}
              />
              <TranslationOutput
                title="Hindi Translation"
                language="Hindi"
                translation={hindiTranslation}
                isLoading={isLoading}
              />
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 justify-center mt-6">
          <Button
            onClick={swapLanguages}
            variant="outline"
            aria-label="Swap languages"
          >
            <Swap className="h-4 w-4 mr-2" />
            Swap Languages
          </Button>
          <Button
            onClick={clearTranslations}
            variant="outline"
            aria-label="Clear all"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>

        {/* Translation Stats */}
        {translationMetadata.totalWords > 0 && (
          <div className="mt-8 p-4 bg-accent/10 rounded-lg text-sm">
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <span className="font-medium">Total Words:</span>
                <span>{translationMetadata.totalWords}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-green-600">Translated:</span>
                <span>{translationMetadata.translatedWords}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-red-600">Untranslated:</span>
                <span>{translationMetadata.untranslatedWords}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Translation Rate:</span>
                <span>{Math.round(translationMetadata.translationRate * 100)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};