import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { getLocales } from 'expo-localization';
import { LANGUAGES, Language, TRANSLATIONS, TranslationKey } from './translations';

interface I18nValue {
  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: TranslationKey) => string;
  /** Formats a date in the current language, e.g. "Oct 1, 2026". */
  formatDate: (iso: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

/** Picks the phone's language if we support it, otherwise English. */
function detectLanguage(): Language {
  const tag = getLocales()[0]?.languageCode ?? 'en';
  return LANGUAGES.some((l) => l.code === tag) ? (tag as Language) : 'en';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(detectLanguage);

  const t = useCallback((key: TranslationKey) => TRANSLATIONS[language][key], [language]);
  const formatDate = useCallback(
    (iso: string) => {
      const locale = LANGUAGES.find((l) => l.code === language)!.locale;
      return new Date(iso).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
    },
    [language],
  );

  const value = useMemo(() => ({ language, setLanguage, t, formatDate }), [language, t, formatDate]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
