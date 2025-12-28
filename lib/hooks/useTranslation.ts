import { useState, useEffect, useCallback } from 'react';
import { TranslationEngine } from '../translationEngine';
import { TargetLanguage } from '../../types/dictionary';

export const useTranslation = () => {
  const [inputText, setInputText] = useState('');
  const [hindiTranslation, setHindiTranslation] = useState('');
  const [englishTranslation, setEnglishTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [translationMetadata, setTranslationMetadata] = useState({
    totalWords: 0,
    translatedWords: 0,
    untranslatedWords: 0,
    translationRate: 0
  });
  const [swapped, setSwapped] = useState(false);
  const [engine, setEngine] = useState<TranslationEngine | null>(null);

  // Initialize translation engine
  useEffect(() => {
    const translationEngine = new TranslationEngine();
    setEngine(translationEngine);
    return () => {
      translationEngine.clearCache();
    };
  }, []);

  // Handle text input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
  }, []);

  // Update counts when input text changes
  useEffect(() => {
    setCharacterCount(inputText.length);
    const words = inputText.trim() === '' ? 0 : inputText.trim().split(/\s+/).length;
    setWordCount(words);
  }, [inputText]);

  // Clear all translations
  const clearTranslations = useCallback(() => {
    setInputText('');
    setHindiTranslation('');
    setEnglishTranslation('');
    setCharacterCount(0);
    setWordCount(0);
    setTranslationMetadata({
      totalWords: 0,
      translatedWords: 0,
      untranslatedWords: 0,
      translationRate: 0
    });
  }, []);

  // Swap languages
  const swapLanguages = useCallback(() => {
    setSwapped(prev => !prev);
  }, []);

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }, []);

  // Translate text
  const translateText = useCallback(async (text: string) => {
    if (!engine || text.trim() === '') {
      setHindiTranslation('');
      setEnglishTranslation('');
      setTranslationMetadata({
        totalWords: 0,
        translatedWords: 0,
        untranslatedWords: 0,
        translationRate: 0
      });
      return;
    }

    setIsLoading(true);

    try {
      // Translate to Hindi
      const hindiResult = engine.translateText(text, 'hindi');
      const englishResult = engine.translateText(text, 'english');

      setHindiTranslation(hindiResult.translation);
      setEnglishTranslation(englishResult.translation);
      setTranslationMetadata(hindiResult.metadata);
    } catch (error) {
      console.error('Translation error:', error);
      setHindiTranslation('Translation error occurred');
      setEnglishTranslation('Translation error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [engine]);

  // Auto-translate when input text changes
  useEffect(() => {
    if (inputText.trim() === '') {
      setHindiTranslation('');
      setEnglishTranslation('');
      setTranslationMetadata({
        totalWords: 0,
        translatedWords: 0,
        untranslatedWords: 0,
        translationRate: 0
      });
      return;
    }

    const debounceTimer = setTimeout(() => {
      translateText(inputText);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [inputText, translateText]);

  return {
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
  };
};