'use client';

import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/CopyButton';

export interface SongLyricPanelProps {
  title: string;
  badgeText: string;
  lines: string[];
  copyText?: string;
  isLoading?: boolean;
  highlightUntranslated?: boolean;
  className?: string;
}

export const SongLyricPanel = ({
  title,
  badgeText,
  lines,
  copyText,
  isLoading = false,
  highlightUntranslated = false,
  className = ''
}: SongLyricPanelProps) => {
  const highlightedLineNodes = useMemo(() => {
    if (!highlightUntranslated) return null;

    return lines.map((line) => {
      const parts = line.split(/(\[[^\]]+\])/g);

      return parts.map((part, idx) => {
        if (part.startsWith('[') && part.endsWith(']')) {
          return (
            <span key={idx} className="untranslated-word">
              {part}
            </span>
          );
        }

        return <span key={idx}>{part}</span>;
      });
    });
  }, [highlightUntranslated, lines]);

  return (
    <Card className={`flex flex-col h-full ${className} print:shadow-none`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 print:pb-4">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {badgeText}
          </Badge>
          <span>{title}</span>
        </CardTitle>
        {copyText !== undefined && (
          <CopyButton
            textToCopy={copyText}
            ariaLabel={`Copy ${badgeText} text`}
            className="print:hidden"
          />
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-auto print:overflow-visible">
        {isLoading ? (
          <div className="min-h-[160px] flex items-center justify-center text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Translating...</span>
            </div>
          </div>
        ) : lines.length === 0 ? (
          <div className="min-h-[160px] flex items-center justify-center text-muted-foreground text-sm">
            Paste lyrics to see translation
          </div>
        ) : (
          <div className="w-full font-mono text-sm leading-6 md:text-[15px] md:leading-7">
            {lines.map((line, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[3.25rem_1fr] gap-3 py-0.5"
              >
                <div className="select-none text-right tabular-nums text-muted-foreground">
                  {idx + 1}
                </div>
                <div className="whitespace-pre-wrap break-words min-h-[1.5rem]">
                  {highlightUntranslated
                    ? highlightedLineNodes?.[idx] ?? (line || ' ')
                    : line || ' '}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
