import { TranslationEngine } from '../lib/translationEngine';
import { DictionaryEntry } from '../types/dictionary';

describe('TranslationEngine', () => {
  let engine: TranslationEngine;

  beforeAll(() => {
    engine = new TranslationEngine();
  });

  describe('tokenizeText', () => {
    it('should tokenize simple text', () => {
      const tokens = engine.tokenizeText('Namaste Shukriya');
      expect(tokens).toEqual(['Namaste', 'Shukriya']);
    });

    it('should preserve phrases', () => {
      const tokens = engine.tokenizeText('Khaana khana');
      expect(tokens).toEqual(['Khaana khana']);
    });

    it('should handle mixed phrases and words', () => {
      const tokens = engine.tokenizeText('Mujhe khaana khana hai');
      expect(tokens).toContain('khaana khana');
    });
  });

  describe('findPhraseInDict', () => {
    it('should find existing phrase', () => {
      const phrase = engine.findPhraseInDict('Khaana khana');
      expect(phrase).toBeDefined();
      expect(phrase?.english_meaning).toBe('To eat food');
    });

    it('should return undefined for non-existing phrase', () => {
      const phrase = engine.findPhraseInDict('Non existing phrase');
      expect(phrase).toBeUndefined();
    });
  });

  describe('findWordInDict', () => {
    it('should find existing word', () => {
      const word = engine.findWordInDict('Namaste');
      expect(word).toBeDefined();
      expect(word?.english_meaning).toBe('Hello');
    });

    it('should return undefined for non-existing word', () => {
      const word = engine.findWordInDict('NonExisting');
      expect(word).toBeUndefined();
    });

    it('should be case insensitive', () => {
      const word = engine.findWordInDict('namaste');
      expect(word).toBeDefined();
      expect(word?.english_meaning).toBe('Hello');
    });
  });

  describe('translateText', () => {
    it('should translate to English', () => {
      const result = engine.translateText('Namaste Shukriya', 'english');
      expect(result.translation).toBe('Hello Thank you');
      expect(result.metadata.translatedWords).toBe(2);
    });

    it('should translate to Hindi', () => {
      const result = engine.translateText('Namaste Shukriya', 'hindi');
      expect(result.translation).toBe('नमस्ते धन्यवाद');
      expect(result.metadata.translatedWords).toBe(2);
    });

    it('should mark untranslated words', () => {
      const result = engine.translateText('Namaste UnknownWord Shukriya', 'english');
      expect(result.translation).toContain('[UnknownWord]');
      expect(result.metadata.untranslatedWords).toBe(1);
    });

    it('should handle phrases', () => {
      const result = engine.translateText('Khaana khana', 'english');
      expect(result.translation).toBe('To eat food');
      expect(result.metadata.translatedWords).toBe(1);
    });

    it('should use cache', () => {
      const text = 'Namaste Shukriya';
      engine.translateText(text, 'english');
      engine.translateText(text, 'english');
      expect(engine.getCacheSize()).toBe(1);
    });
  });

  describe('markUntranslatedWords', () => {
    it('should mark untranslated words', () => {
      const result = engine.markUntranslatedWords('Namaste UnknownWord Shukriya');
      expect(result.markedText).toBe('Namaste [UnknownWord] Shukriya');
      expect(result.untranslatedWords).toEqual(['UnknownWord']);
    });

    it('should not mark translated words', () => {
      const result = engine.markUntranslatedWords('Namaste Shukriya');
      expect(result.markedText).toBe('Namaste Shukriya');
      expect(result.untranslatedWords).toEqual([]);
    });
  });

  describe('getTranslationMetadata', () => {
    it('should return correct metadata', () => {
      const metadata = engine.getTranslationMetadata('Namaste UnknownWord Shukriya', 'english');
      expect(metadata.totalWords).toBe(3);
      expect(metadata.translatedWords).toBe(2);
      expect(metadata.untranslatedWords).toBe(1);
      expect(metadata.translationRate).toBeCloseTo(2/3);
    });
  });

  describe('getDictionaryStats', () => {
    it('should return dictionary statistics', () => {
      const stats = engine.getDictionaryStats();
      expect(stats.totalEntries).toBeGreaterThan(50);
      expect(stats.categories['noun']).toBeDefined();
      expect(stats.categories['verb']).toBeDefined();
      expect(stats.categories['phrase']).toBeDefined();
    });
  });

  describe('cache management', () => {
    it('should clear cache', () => {
      engine.translateText('Namaste', 'english');
      expect(engine.getCacheSize()).toBeGreaterThan(0);
      engine.clearCache();
      expect(engine.getCacheSize()).toBe(0);
    });
  });
});