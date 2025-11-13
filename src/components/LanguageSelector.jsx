import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSelector() {
  const { currentLanguage, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="language-selector-wrapper" ref={dropdownRef}>
      <button
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="flag">{languages[currentLanguage]?.flag}</span>
        <span className="language-name">{languages[currentLanguage]?.nativeName || languages[currentLanguage]?.name}</span>
        <span className="arrow" aria-hidden="true">▼</span>
      </button>

      {isOpen && (
        <div className="language-dropdown" role="dialog" aria-label="Select language">
          <div className="language-groups">
            {Object.entries(languages).map(([code, lang]) => (
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
                  {lang.nativeName !== lang.name && (
                    <span className="english-name"> ({lang.name})</span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}