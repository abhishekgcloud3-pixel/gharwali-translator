'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { TranslationMode } from '@/lib/hooks/useSongTranslation';

export interface TranslationModeToggleProps {
  mode: TranslationMode;
  onModeChange: (mode: TranslationMode) => void;
}

export const TranslationModeToggle = ({ mode, onModeChange }: TranslationModeToggleProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Translation mode</span>
        <Badge variant={mode === 'meaning' ? 'default' : 'outline'} className="text-[11px]">
          {mode === 'literal' ? 'Literal' : 'Meaning'}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={mode === 'literal' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onModeChange('literal')}
        >
          Literal
        </Button>
        <Button
          type="button"
          variant={mode === 'meaning' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onModeChange('meaning')}
        >
          Meaning
        </Button>
        <p className="text-xs text-muted-foreground max-w-[46rem]">
          Literal = word-for-word. Meaning = phrase-level + cultural mappings (best for songs).
        </p>
      </div>
    </div>
  );
};
