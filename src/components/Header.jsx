import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const toggle = () => setOpen((v) => !v);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand animated-logo" href="/">MediSync</a>

        <nav className={`site-nav ${open ? 'show' : ''}`} id="siteNav" aria-label="Primary">
          <a href="#features" className="nav-link">{t('nav.features')}</a>
          <a href="#problems" className="nav-link">{t('nav.problems')}</a>
          <a href="#tech" className="nav-link">{t('nav.technology')}</a>
        </nav>

        <div className="header-top-controls">
          <button 
            className="btn btn-primary cta pulse-animation"
            onClick={() => {
              const contactSection = document.getElementById('contact') || document.getElementById('find');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            {t('nav.requestDemo')}
          </button>
          <div className="language-wrap">
            <LanguageSelector />
          </div>
        </div>

        <button
          className="nav-toggle"
          id="navToggle"
          aria-controls="siteNav"
          aria-expanded={open}
          onClick={toggle}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>
    </header>
  )
}
