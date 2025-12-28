import { DictionaryEntry } from '../types/dictionary';

export class Tokenizer {
  private dictionary: DictionaryEntry[];
  private phraseCache: Map<string, boolean>;

  constructor(dictionary: DictionaryEntry[]) {
    this.dictionary = dictionary;
    this.phraseCache = new Map();
    this.buildPhraseCache();
  }

  private buildPhraseCache(): void {
    // Pre-cache all phrases for faster lookup
    for (const entry of this.dictionary) {
      if (entry.category === 'phrase' || entry.category === 'song_phrase') {
        this.phraseCache.set(entry.garhwali_word.toLowerCase(), true);
      }
    }
  }

  public tokenizeText(text: string): string[] {
    // Split text into tokens while preserving phrases
    const words = text.split(/(\s+)/).filter(token => token.trim().length > 0);
    
    // Merge words into phrases where possible
    const tokens: string[] = [];
    let i = 0;
    
    while (i < words.length) {
      // Check for phrases starting at current position
      let phraseFound = false;
      const maxPhraseLength = Math.min(5, words.length - i); // Limit phrase length to 5 words
      
      for (let length = maxPhraseLength; length >= 2; length--) {
        const potentialPhrase = words.slice(i, i + length).join(' ').toLowerCase();
        if (this.phraseCache.has(potentialPhrase)) {
          tokens.push(words.slice(i, i + length).join(' '));
          i += length;
          phraseFound = true;
          break;
        }
      }
      
      if (!phraseFound) {
        tokens.push(words[i]);
        i++;
      }
    }
    
    return tokens;
  }

  public findPhrasesInText(text: string): string[] {
    const phrases: string[] = [];
    const lowerText = text.toLowerCase();
    
    for (const entry of this.dictionary) {
      if ((entry.category === 'phrase' || entry.category === 'song_phrase') && 
          lowerText.includes(entry.garhwali_word.toLowerCase())) {
        phrases.push(entry.garhwali_word);
      }
    }
    
    return phrases;
  }

  public getWordCount(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }
}