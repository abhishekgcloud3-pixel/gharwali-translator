export interface DictionaryEntry {
  garhwali_word: string;
  hindi_meaning: string;
  english_meaning: string;
  usage_example: string;
  category: 'noun' | 'verb' | 'phrase' | 'song_phrase' | 'adjective' | 'adverb';
}

export interface TranslationMetadata {
  totalWords: number;
  translatedWords: number;
  untranslatedWords: number;
  translationRate: number;
}

export type TargetLanguage = 'hindi' | 'english';