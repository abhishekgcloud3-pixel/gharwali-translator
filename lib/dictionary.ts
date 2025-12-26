import 'server-only';

const dictionaries = {
  en: () => import('./dictionary/en.json').then((module) => module.default),
  // Add other languages here
};

export const getDictionary = async (locale: keyof typeof dictionaries) =>
  dictionaries[locale]();
