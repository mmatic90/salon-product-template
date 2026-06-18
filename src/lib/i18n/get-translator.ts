import {
  dictionaries,
  type AppLanguage,
  type TranslationKey,
} from "./dictionaries";

export function normalizeLanguage(value: string | null | undefined): AppLanguage {
  if (value === "en" || value === "it" || value === "hr") {
    return value;
  }

  return "hr";
}

export function getTranslator(language: string | null | undefined) {
  const normalized = normalizeLanguage(language);
  const dictionary = dictionaries[normalized];

  return function t(key: TranslationKey) {
    return dictionary[key] ?? dictionaries.hr[key] ?? key;
  };
}