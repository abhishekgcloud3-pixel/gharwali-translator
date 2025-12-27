import { DictionaryEntry, TranslationMetadata, TargetLanguage } from '../types/dictionary';
import { Tokenizer } from './tokenizer';
import dictionaryData from './garhwali_dictionary.json';

export class TranslationEngine {
  private dictionary: DictionaryEntry[];
  private tokenizer: Tokenizer;
  private wordIndex: Map<string, DictionaryEntry>;
  private phraseIndex: Map<string, DictionaryEntry>;
  private translationCache: Map<string, { translation: string; metadata: TranslationMetadata }>;

  constructor() {
    this.dictionary = dictionaryData;
    this.tokenizer = new Tokenizer(this.dictionary);
    this.wordIndex = new Map();
    this.phraseIndex = new Map();
    this.translationCache = new Map();
    this.buildIndexes();
  }

  private buildIndexes(): void {
    // Build word-level index
    for (const entry of this.dictionary) {
      this.wordIndex.set(entry.garhwali_word.toLowerCase(), entry);
    }
    
    // Build phrase-level index
    for (const entry of this.dictionary) {
      if (entry.category === 'phrase' || entry.category === 'song_phrase') {
        this.phraseIndex.set(entry.garhwali_word.toLowerCase(), entry);
      }
    }
  }

  public tokenizeText(text: string): string[] {
    return this.tokenizer.tokenizeText(text);
  }

  public findPhraseInDict(phrase: string): DictionaryEntry | undefined {
    return this.phraseIndex.get(phrase.toLowerCase());
  }

  public findWordInDict(word: string): DictionaryEntry | undefined {
    return this.wordIndex.get(word.toLowerCase());
  }

  public translateText(text: string, targetLang: TargetLanguage): { translation: string; metadata: TranslationMetadata } {
    const cacheKey = `${text}|${targetLang}`;
    
    // Check cache first
    if (this.translationCache.has(cacheKey)) {
      return this.translationCache.get(cacheKey)!;
    }

    const tokens = this.tokenizeText(text);
    let translation = '';
    let translatedCount = 0;
    let untranslatedWords: string[] = [];

    for (const token of tokens) {
      // Try phrase lookup first
      let entry = this.findPhraseInDict(token);
      
      // Fallback to word lookup
      if (!entry) {
        entry = this.findWordInDict(token);
      }

      if (entry) {
        const meaning = targetLang === 'hindi' ? entry.hindi_meaning : entry.english_meaning;
        translation += meaning + ' ';
        translatedCount++;
      } else {
        // Mark untranslated words
        translation += `[${token}]` + ' ';
        untranslatedWords.push(token);
      }
    }

    const metadata: TranslationMetadata = {
      totalWords: tokens.length,
      translatedWords: translatedCount,
      untranslatedWords: untranslatedWords.length,
      translationRate: tokens.length > 0 ? translatedCount / tokens.length : 0
    };

    const result = {
      translation: translation.trim(),
      metadata
    };

    // Cache the result
    this.translationCache.set(cacheKey, result);

    return result;
  }

  public markUntranslatedWords(text: string): { markedText: string; untranslatedWords: string[] } {
    const tokens = this.tokenizeText(text);
    const untranslatedWords: string[] = [];
    const markedTokens: string[] = [];

    for (const token of tokens) {
      const entry = this.findPhraseInDict(token) || this.findWordInDict(token);
      
      if (entry) {
        markedTokens.push(token);
      } else {
        markedTokens.push(`[${token}]`);
        untranslatedWords.push(token);
      }
    }

    return {
      markedText: markedTokens.join(' '),
      untranslatedWords
    };
  }

  public getTranslationMetadata(text: string, targetLang: TargetLanguage): TranslationMetadata {
    const result = this.translateText(text, targetLang);
    return result.metadata;
  }

  public getDictionaryStats(): { totalEntries: number; categories: Record<string, number> } {
    const categories: Record<string, number> = {};
    
    for (const entry of this.dictionary) {
      categories[entry.category] = (categories[entry.category] || 0) + 1;
    }

    return {
      totalEntries: this.dictionary.length,
      categories
    };
  }

  public clearCache(): void {
    this.translationCache.clear();
  }

  public getCacheSize(): number {
    return this.translationCache.size;
  }
}