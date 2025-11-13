import { createContext, useContext, useState } from 'react';

// Expanded language support including Indian languages
const languages = {
  en: {
    name: 'English',
    flag: '🇺🇸',
    nativeName: 'English'
  },
  hi: {
    name: 'Hindi',
    flag: '🇮🇳',
    nativeName: 'हिन्दी'
  },
  bn: {
    name: 'Bengali',
    flag: '🇮🇳',
    nativeName: 'বাংলা'
  },
  te: {
    name: 'Telugu',
    flag: '🇮🇳',
    nativeName: 'తెలుగు'
  },
  mr: {
    name: 'Marathi',
    flag: '🇮🇳',
    nativeName: 'मराठी'
  },
  ta: {
    name: 'Tamil',
    flag: '🇮🇳',
    nativeName: 'தமிழ்'
  },
  gu: {
    name: 'Gujarati',
    flag: '🇮🇳',
    nativeName: 'ગુજરાતી'
  },
  kn: {
    name: 'Kannada',
    flag: '🇮🇳',
    nativeName: 'ಕನ್ನಡ'
  },
  ml: {
    name: 'Malayalam',
    flag: '🇮🇳',
    nativeName: 'മലയാളം'
  },
  pa: {
    name: 'Punjabi',
    flag: '🇮🇳',
    nativeName: 'ਪੰਜਾਬੀ'
  },
  sd: {
    name: 'Sindhi',
    flag: '🇮🇳',
    nativeName: 'سنڌي'
  },
  sa: {
    name: 'Sanskrit',
    flag: '🇮🇳',
    nativeName: 'संस्कृतम्'
  },
  bho: {
    name: 'Bhojpuri',
    flag: '🇮🇳',
    nativeName: 'भोजपुरी'
  },
  mai: {
    name: 'Maithili',
    flag: '🇮🇳',
    nativeName: 'मैथिली'
  },
  nep: {
    name: 'Nepali',
    flag: '🇳🇵',
    nativeName: 'नेपाली'
  },
  tpi: {
    name: 'Tulu',
    flag: '🇮🇳',
    nativeName: 'ತುಳು'
  },
  ks: {
    name: 'Kashmiri',
    flag: '🇮🇳',
    nativeName: 'کٔشُر'
  },
  or: {
    name: 'Odia',
    flag: '🇮🇳',
    nativeName: 'ଓଡ଼ିଆ'
  },
  as: {
    name: 'Assamese',
    flag: '🇮🇳',
    nativeName: 'অসমীয়া'
  },
  // Add more Indian languages as needed
};

// Common translations for all supported languages
const translations = {
  en: {
    common: {
      login: 'Login',
      signup: 'Sign Up',
      dashboard: 'Dashboard',
      appointments: 'Appointments',
      profile: 'Profile',
      logout: 'Logout',
      requestDemo: 'Request Demo',
      search: 'Search',
      findDoctor: 'Find a Doctor',
      book: 'Book Appointment',
      welcome: 'Welcome to MediSync',
      settings: 'Settings'
    }
  },
  hi: {
    common: {
      login: 'लॉग इन',
      signup: 'साइन अप',
      dashboard: 'डैशबोर्ड',
      appointments: 'अपॉइंटमेंट',
      profile: 'प्रोफ़ाइल',
      logout: 'लॉग आउट',
      requestDemo: 'डेमो अनुरोध करें',
      search: 'खोजें',
      findDoctor: 'डॉक्टर खोजें',
      book: 'अपॉइंटमेंट बुक करें',
      welcome: 'मेडीसिंक में आपका स्वागत है',
      settings: 'सेटिंग्स'
    }
  },
  // Add translations for other languages
};

const LanguageContext = createContext(null);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');

  // Get language preferences from browser
  const getBrowserLanguages = () => {
    const browserLangs = navigator.languages || [navigator.language];
    return browserLangs.map(lang => lang.split('-')[0]);
  };

  // Detect user's preferred language
  const detectPreferredLanguage = () => {
    const browserLangs = getBrowserLanguages();
    const supportedLang = browserLangs.find(lang => languages[lang]);
    return supportedLang || 'en';
  };

  // Initialize with detected language
  useState(() => {
    const detected = detectPreferredLanguage();
    setCurrentLanguage(detected);
  }, []);

  const value = {
    currentLanguage,
    setLanguage: setCurrentLanguage,
    languages,
    translations,
    searchQuery,
    setSearchQuery,
    t: (key) => {
      const keys = key.split('.');
      let translation = translations[currentLanguage];
      for (const k of keys) {
        translation = translation?.[k];
      }
      return translation || translations.en[keys[0]]?.[keys[1]] || key;
    }
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}