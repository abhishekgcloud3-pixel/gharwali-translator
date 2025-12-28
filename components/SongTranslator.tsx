'use client';

import { useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SongLyricPanel } from '@/components/SongLyricPanel';
import { TranslationModeToggle } from '@/components/TranslationModeToggle';
import { useSongTranslation } from '@/lib/hooks/useSongTranslation';
import { Copy, Eraser } from 'lucide-react';
import SpeechInputButton from './SpeechInputButton';

const inputBaseClass =
  'w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background ' +
  'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

export const SongTranslator = () => {
  const {
    lyrics,
    setLyrics,
    lyricLines,
    lineCount,
    wordCount,
    mode,
    setMode,
    metadata,
    setMetadataField,
    hindiLines,
    englishLines,
    isTranslating,
    untranslatedWords,
    buildPlainTextTranslation,
    buildBothTranslationsText,
    copyTranslation
  } = useSongTranslation();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lineNumberRef = useRef<HTMLPreElement | null>(null);

  const lineNumberText = useMemo(() => {
    const safeLineCount = Math.max(1, lineCount);
    return Array.from({ length: safeLineCount }, (_, i) => String(i + 1)).join('\n');
  }, [lineCount]);

  const handleSpeechTranscript = (transcript: string) => {
    if (!textareaRef.current) {
      setLyrics((prev: string) => prev + (prev.length > 0 ? ' ' : '') + transcript);
      return;
    }

    const { selectionStart, selectionEnd } = textareaRef.current;
    const currentText = lyrics;
    
    const prefix = currentText.substring(0, selectionStart);
    const suffix = currentText.substring(selectionEnd);
    
    const newText = 
      prefix + 
      (selectionStart > 0 && !prefix.endsWith(' ') ? ' ' : '') +
      transcript + 
      (!suffix.startsWith(' ') && suffix.length > 0 ? ' ' : '') +
      suffix;

    setLyrics(newText);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = selectionStart + transcript.length + (selectionStart > 0 && !prefix.endsWith(' ') ? 1 : 0);
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleScrollSync = () => {
    if (!textareaRef.current || !lineNumberRef.current) return;
    lineNumberRef.current.scrollTop = textareaRef.current.scrollTop;
  };

  return (
    <div className="container mx-auto px-4 py-8 print:py-0">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Garhwali Song Translator
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Paste Garhwali lyrics to see line-by-line Hindi and English translations. Formatting and stanza
            breaks are preserved; unknown words are highlighted.
          </p>
        </div>

        {/* Print header */}
        <div className="hidden print:block mb-6">
          <div className="text-xl font-semibold">{metadata.title || 'Garhwali Song Translation'}</div>
          <div className="mt-2 text-sm text-muted-foreground">
            {metadata.artist && <div>Artist/Composer: {metadata.artist}</div>}
            {metadata.region && <div>Region/Tradition: {metadata.region}</div>}
            <div>Mode: {mode === 'literal' ? 'Literal' : 'Meaning'}</div>
          </div>
          <div className="mt-4 h-px w-full bg-border" />
        </div>

        {/* Metadata */}
        <Card className="mb-6 print:hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Optional
              </Badge>
              <span>Song metadata</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="song-title">
                  Song title
                </label>
                <input
                  id="song-title"
                  value={metadata.title}
                  onChange={(e) => setMetadataField('title', e.target.value)}
                  placeholder="e.g., Bedu Pako"
                  className={inputBaseClass}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="song-artist">
                  Artist / composer
                </label>
                <input
                  id="song-artist"
                  value={metadata.artist}
                  onChange={(e) => setMetadataField('artist', e.target.value)}
                  placeholder="e.g., Traditional"
                  className={inputBaseClass}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="song-region">
                  Region / tradition
                </label>
                <input
                  id="song-region"
                  value={metadata.region}
                  onChange={(e) => setMetadataField('region', e.target.value)}
                  placeholder="e.g., Garhwal (Uttarakhand)"
                  className={inputBaseClass}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lyrics input */}
        <Card className="mb-6 print:hidden">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Garhwali
                </Badge>
                <span>Lyrics</span>
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>Lines: {lineCount}</span>
                  <span>Words: {wordCount}</span>
                </div>
                <SpeechInputButton onTranscriptChange={handleSpeechTranscript} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-[3.25rem_1fr] gap-0 rounded-md border border-input overflow-hidden">
                <pre
                  ref={lineNumberRef}
                  className="h-[320px] md:h-[420px] overflow-hidden bg-muted/30 text-muted-foreground text-xs md:text-sm font-mono leading-6 md:leading-7 py-2 pr-2 text-right select-none"
                  aria-hidden
                >
                  {lineNumberText}
                </pre>
                <Textarea
                  ref={textareaRef}
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  onScroll={handleScrollSync}
                  placeholder="Paste Garhwali lyrics here...\n\nTip: Blank lines will be preserved as stanza breaks."
                  className="h-[320px] md:h-[420px] rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-2 font-mono text-sm md:text-base leading-6 md:leading-7 resize-none"
                  spellCheck={false}
                  aria-label="Garhwali song lyrics input"
                />
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <TranslationModeToggle mode={mode} onModeChange={setMode} />

                <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => copyTranslation('hindi')}
                    disabled={hindiLines.length === 0}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Hindi
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => copyTranslation('english')}
                    disabled={englishLines.length === 0}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy English
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => copyTranslation('both')}
                    disabled={hindiLines.length === 0 && englishLines.length === 0}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Both
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLyrics('')}
                    disabled={!lyrics}
                  >
                    <Eraser className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>

              {untranslatedWords.length > 0 && (
                <div className="rounded-md border bg-accent/10 p-3">
                  <div className="text-sm font-medium mb-2">Untranslated words</div>
                  <div className="flex flex-wrap gap-2">
                    {untranslatedWords.map((w) => (
                      <span
                        key={w}
                        className="text-xs px-2 py-1 rounded-full border bg-background"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Outputs */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Line-by-line translation</h2>
            <Badge variant={mode === 'meaning' ? 'default' : 'outline'} className="text-[11px]">
              {mode === 'literal' ? 'Literal' : 'Meaning'}
            </Badge>
          </div>

          <div className="text-xs text-muted-foreground">
            {isTranslating && <span>Updating…</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 print:grid-cols-3">
          <SongLyricPanel
            title="Original Lyrics"
            badgeText="Garhwali"
            lines={lyricLines}
            copyText={lyrics}
            isLoading={false}
            className="print:break-inside-avoid"
          />

          <SongLyricPanel
            title="Hindi Translation"
            badgeText="Hindi"
            lines={hindiLines}
            copyText={buildPlainTextTranslation('hindi')}
            isLoading={isTranslating}
            highlightUntranslated
            className="print:break-inside-avoid"
          />

          <SongLyricPanel
            title="English Translation"
            badgeText="English"
            lines={englishLines}
            copyText={buildPlainTextTranslation('english')}
            isLoading={isTranslating}
            highlightUntranslated
            className="print:break-inside-avoid"
          />
        </div>

        <div className="mt-6 print:hidden">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Copy-friendly full output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Hindi (full)</div>
                  <pre className="rounded-md border bg-background p-3 text-xs whitespace-pre-wrap break-words max-h-[240px] overflow-auto">
                    {buildPlainTextTranslation('hindi')}
                  </pre>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">English (full)</div>
                  <pre className="rounded-md border bg-background p-3 text-xs whitespace-pre-wrap break-words max-h-[240px] overflow-auto">
                    {buildPlainTextTranslation('english')}
                  </pre>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs text-muted-foreground">Both (full)</div>
                <pre className="rounded-md border bg-background p-3 text-xs whitespace-pre-wrap break-words max-h-[240px] overflow-auto">
                  {buildBothTranslationsText()}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
