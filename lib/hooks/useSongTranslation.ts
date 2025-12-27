'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TranslationEngine } from '@/lib/translationEngine';
import dictionaryData from '@/lib/garhwali_dictionary.json';
import type { DictionaryEntry, TargetLanguage } from '@/types/dictionary';

export type TranslationMode = 'literal' | 'meaning';

export interface SongMetadata {
  title: string;
  artist: string;
  region: string;
}

type PhraseCandidate = {
  entry: DictionaryEntry;
  words: string[];
};

const buildPhraseStartIndex = (dictionary: DictionaryEntry[]) => {
  const phraseEntries = dictionary.filter(
    (e) => e.category === 'phrase' || e.category === 'song_phrase'
  );

  const candidates: PhraseCandidate[] = phraseEntries
    .map((entry) => ({
      entry,
      words: entry.garhwali_word
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
    }))
    .filter((c) => c.words.length >= 2);

  const index = new Map<string, PhraseCandidate[]>();

  for (const c of candidates) {
    const first = c.words[0];
    const list = index.get(first) ?? [];
    list.push(c);
    index.set(first, list);
  }

  for (const [, list] of index.entries()) {
    list.sort((a, b) => {
      const categoryScoreA = a.entry.category === 'song_phrase' ? 1 : 0;
      const categoryScoreB = b.entry.category === 'song_phrase' ? 1 : 0;
      if (categoryScoreA !== categoryScoreB) return categoryScoreB - categoryScoreA;
      return b.words.length - a.words.length;
    });
  }

  return index;
};

const PHRASE_START_INDEX = buildPhraseStartIndex(dictionaryData as DictionaryEntry[]);

const isWordChar = (ch: string) => /[\p{L}\p{N}]/u.test(ch);

const splitPunctuation = (token: string) => {
  const chars = [...token];
  const start = chars.findIndex(isWordChar);

  if (start === -1) {
    return { prefix: '', core: '', suffix: '', raw: token };
  }

  let end = chars.length - 1;
  while (end >= 0 && !isWordChar(chars[end])) end--;

  return {
    prefix: token.slice(0, start),
    core: token.slice(start, end + 1),
    suffix: token.slice(end + 1),
    raw: token
  };
};

const translateToken = (
  engine: TranslationEngine,
  core: string,
  targetLang: TargetLanguage
): { translated: string; translatedOk: boolean } => {
  const entry = engine.findWordInDict(core);
  if (!entry) return { translated: `[${core}]`, translatedOk: false };

  return {
    translated: targetLang === 'hindi' ? entry.hindi_meaning : entry.english_meaning,
    translatedOk: true
  };
};

const findBestPhraseAt = (
  engine: TranslationEngine,
  wordCoresLower: string[],
  startWordIndex: number
): { entry: DictionaryEntry; length: number } | null => {
  const first = wordCoresLower[startWordIndex];
  if (!first) return null;

  const candidates = PHRASE_START_INDEX.get(first);
  if (!candidates || candidates.length === 0) return null;

  for (const candidate of candidates) {
    const len = candidate.words.length;
    if (startWordIndex + len > wordCoresLower.length) continue;

    let matches = true;
    for (let i = 0; i < len; i++) {
      if (wordCoresLower[startWordIndex + i] !== candidate.words[i]) {
        matches = false;
        break;
      }
    }

    if (!matches) continue;

    const phraseKey = candidate.words.join(' ');
    const entry = engine.findPhraseInDict(phraseKey);

    if (entry) {
      return { entry, length: len };
    }
  }

  return null;
};

const translateLine = (
  engine: TranslationEngine,
  line: string,
  targetLang: TargetLanguage,
  mode: TranslationMode,
  untranslatedWords: Set<string>
) => {
  const parts = line.match(/\s+|[^\s]+/g) ?? [];

  const wordPartIndices: number[] = [];
  const wordCores: string[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part || part.trim() === '') continue;
    const { core } = splitPunctuation(part);
    if (core) {
      wordPartIndices.push(i);
      wordCores.push(core);
    }
  }

  const wordCoresLower = wordCores.map((w) => w.toLowerCase());
  const partIndexToWordIndex = new Map<number, number>();
  wordPartIndices.forEach((partIndex, wordIndex) => {
    partIndexToWordIndex.set(partIndex, wordIndex);
  });

  let out = '';
  let partIndex = 0;

  while (partIndex < parts.length) {
    const part = parts[partIndex];

    if (!part) {
      partIndex++;
      continue;
    }

    if (part.trim() === '') {
      out += part;
      partIndex++;
      continue;
    }

    const { prefix, core, suffix, raw } = splitPunctuation(part);

    if (!core) {
      out += raw;
      partIndex++;
      continue;
    }

    if (mode === 'meaning') {
      const wordIndex = partIndexToWordIndex.get(partIndex);

      if (wordIndex !== undefined) {
        const phrase = findBestPhraseAt(engine, wordCoresLower, wordIndex);

        if (phrase && phrase.length >= 2) {
          const firstPartIndex = wordPartIndices[wordIndex];
          const lastPartIndex = wordPartIndices[wordIndex + phrase.length - 1];

          const firstSplit = splitPunctuation(parts[firstPartIndex]);
          const lastSplit = splitPunctuation(parts[lastPartIndex]);

          const phraseMeaning =
            targetLang === 'hindi' ? phrase.entry.hindi_meaning : phrase.entry.english_meaning;

          out += `${firstSplit.prefix}${phraseMeaning}${lastSplit.suffix}`;
          partIndex = lastPartIndex + 1;
          continue;
        }
      }
    }

    const { translated, translatedOk } = translateToken(engine, core, targetLang);

    if (!translatedOk) {
      untranslatedWords.add(core);
    }

    out += `${prefix}${translated}${suffix}`;
    partIndex++;
  }

  return out;
};

export const useSongTranslation = () => {
  const [lyrics, setLyrics] = useState('');
  const [mode, setMode] = useState<TranslationMode>('meaning');
  const [metadata, setMetadata] = useState<SongMetadata>({
    title: '',
    artist: '',
    region: ''
  });

  const [hindiLines, setHindiLines] = useState<string[]>([]);
  const [englishLines, setEnglishLines] = useState<string[]>([]);
  const [untranslatedWords, setUntranslatedWords] = useState<string[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);

  const [engine, setEngine] = useState<TranslationEngine | null>(null);

  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    const translationEngine = new TranslationEngine();
    setEngine(translationEngine);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      translationEngine.clearCache();
    };
  }, []);

  const lyricLines = useMemo(() => {
    return lyrics.split(/\r?\n/);
  }, [lyrics]);

  const lineCount = lyricLines.length;

  const wordCount = useMemo(() => {
    const trimmed = lyrics.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  }, [lyrics]);

  useEffect(() => {
    if (!engine) return;

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    if (lyrics.trim() === '') {
      setHindiLines([]);
      setEnglishLines([]);
      setUntranslatedWords([]);
      setIsTranslating(false);
      return;
    }

    setIsTranslating(true);

    debounceRef.current = window.setTimeout(() => {
      const untranslated = new Set<string>();

      const hindi = lyricLines.map((line) =>
        translateLine(engine, line, 'hindi', mode, untranslated)
      );
      const english = lyricLines.map((line) =>
        translateLine(engine, line, 'english', mode, untranslated)
      );

      setHindiLines(hindi);
      setEnglishLines(english);
      setUntranslatedWords(Array.from(untranslated).sort((a, b) => a.localeCompare(b)));
      setIsTranslating(false);
    }, 200);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [engine, lyrics, lyricLines, mode]);

  const setMetadataField = useCallback(
    (field: keyof SongMetadata, value: string) => {
      setMetadata((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const buildPlainTextTranslation = useCallback(
    (lang: TargetLanguage) => {
      const translatedLines = lang === 'hindi' ? hindiLines : englishLines;
      const body = translatedLines.join('\n');

      const header: string[] = [];
      if (metadata.title.trim()) header.push(`Title: ${metadata.title.trim()}`);
      if (metadata.artist.trim()) header.push(`Artist/Composer: ${metadata.artist.trim()}`);
      if (metadata.region.trim()) header.push(`Region/Tradition: ${metadata.region.trim()}`);
      header.push(`Mode: ${mode === 'literal' ? 'Literal' : 'Meaning'}`);

      return `${header.join('\n')}\n\n${body}`.trim();
    },
    [englishLines, hindiLines, metadata.artist, metadata.region, metadata.title, mode]
  );

  const buildBothTranslationsText = useCallback(() => {
    const header: string[] = [];
    if (metadata.title.trim()) header.push(`Title: ${metadata.title.trim()}`);
    if (metadata.artist.trim()) header.push(`Artist/Composer: ${metadata.artist.trim()}`);
    if (metadata.region.trim()) header.push(`Region/Tradition: ${metadata.region.trim()}`);
    header.push(`Mode: ${mode === 'literal' ? 'Literal' : 'Meaning'}`);

    return `${header.join('\n')}\n\n[Hindi]\n${hindiLines.join('\n')}\n\n[English]\n${englishLines.join('\n')}`.trim();
  }, [englishLines, hindiLines, metadata.artist, metadata.region, metadata.title, mode]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }, []);

  const copyTranslation = useCallback(
    async (which: 'hindi' | 'english' | 'both') => {
      const text =
        which === 'both'
          ? buildBothTranslationsText()
          : buildPlainTextTranslation(which);

      return copyToClipboard(text);
    },
    [buildBothTranslationsText, buildPlainTextTranslation, copyToClipboard]
  );

  return {
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
  };
};
