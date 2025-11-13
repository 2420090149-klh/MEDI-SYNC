import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSelector() {
  const { currentLanguage, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter languages based on search
  const filteredLanguages = Object.entries(languages).filter(([_, lang]) => {
    const search = searchQuery.toLowerCase();
    return (
      lang.name.toLowerCase().includes(search) ||
      (lang.nativeName && lang.nativeName.toLowerCase().includes(search))
    );
  });

  // Group languages by region (Indian languages vs others)
  const groupedLanguages = filteredLanguages.reduce((acc, [code, lang]) => {
    const group = code === 'en' ? 'International' : 'Indian';
    if (!acc[group]) acc[group] = [];
    acc[group].push([code, lang]);
    return acc;
  }, {});

  return (
    <div className="language-selector-wrapper">
      <button
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="flag">{languages[currentLanguage].flag}</span>
        <span className="language-name">{languages[currentLanguage].nativeName || languages[currentLanguage].name}</span>
        <span className="arrow" aria-hidden="true">▼</span>
      </button>

      {isOpen && (
        <div className="language-dropdown" role="dialog" aria-label="Select language">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search languages"
            />
          </div>

          <div className="language-groups">
            {Object.entries(groupedLanguages).map(([group, langs]) => (
              <div key={group} className="language-group">
                <h3 className="group-title">{group} Languages</h3>
                {langs.map(([code, lang]) => (
                  <button
                    key={code}
                    className={`language-option ${currentLanguage === code ? 'active' : ''}`}
                    onClick={() => {
                      setLanguage(code);
                      setIsOpen(false);
                    }}
                    aria-selected={currentLanguage === code}
                  >
                    <span className="flag">{lang.flag}</span>
                    <span className="language-names">
                      <span className="native-name">{lang.nativeName || lang.name}</span>
                      <span className="english-name">{lang.name}</span>
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}