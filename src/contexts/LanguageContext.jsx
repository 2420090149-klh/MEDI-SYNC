import React, { createContext, useContext, useState, useMemo } from 'react';
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import bho from '../locales/bho.json';
import te from '../locales/te.json';
import ta from '../locales/ta.json';
import kn from '../locales/kn.json';

// Language metadata with proper language codes for text-to-speech
const languages = {
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧', speechLang: 'en-US' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', speechLang: 'hi-IN' },
  te: { name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', speechLang: 'te-IN' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', speechLang: 'ta-IN' },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', speechLang: 'kn-IN' },
  bho: { name: 'Bhojpuri', nativeName: 'भोजपुरी', flag: '🇮🇳', speechLang: 'hi-IN' }
};

const translations = { en, hi, bho, te, ta, kn };

const LanguageContext = createContext();

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function LanguageProvider({ children }) {
  const preferred = (typeof navigator !== 'undefined' && navigator.language)
    ? navigator.language.split('-')[0]
    : 'en';

  const [currentLanguage, setCurrentLanguage] = useState(languages[preferred] ? preferred : 'en');

  const t = (key, fallback = '') => {
    const parts = key.split('.');

    const resolve = (lang) => {
      let node = translations[lang] || {};
      for (const p of parts) {
        node = node?.[p];
        if (node === undefined) return undefined;
      }
      return node;
    };

    // Try current language first
    const current = resolve(currentLanguage);
    if (current !== undefined) return typeof current === 'string' ? current : (fallback || key);

    // Fallback to English if missing
    const enValue = resolve('en');
    if (enValue !== undefined) return typeof enValue === 'string' ? enValue : (fallback || key);

    return fallback || key;
  };

  const value = useMemo(() => ({
    currentLanguage,
    setLanguage: setCurrentLanguage,
    t,
    languages
  }), [currentLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}