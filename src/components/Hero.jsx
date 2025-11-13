import React, { useEffect } from 'react';
import { useScrollReveal, useParallax, useSmoothScroll } from '../hooks/useAnimations';
import { useLanguage } from '../contexts/LanguageContext';

export default function Hero() {
  const [contentRef, isContentVisible] = useScrollReveal();
  const parallaxRef = useParallax(0.3);
  const { t, currentLanguage, languages } = useLanguage();
  
  useSmoothScroll();

  return (
    <section className="hero">
      <div className="container hero-grid">
        <div 
          ref={contentRef} 
          className={`hero-content scroll-reveal ${isContentVisible ? 'visible' : ''}`}
        >
          <h1 className="animated-gradient">
            {t('hero.title')}<br/>
            <span className="accent">{t('hero.subtitle')}</span>
          </h1>
          <p className="lead animated-slide-up">
            {t('hero.description')}
          </p>
          <div className="hero-ctas animated-fade-in">
            <a href="#find" className="btn btn-primary glow-effect">
              {t('common.findDoctor')}
            </a>
            <a href="/auth/login" className="btn btn-outline pulse-effect">
              {t('common.loginSignup')}
            </a>
            <button
              className="btn btn-secondary"
              onClick={() => {
                const text = `${t('hero.title')} - ${t('hero.subtitle')}. ${t('hero.description')}`;
                const utter = new SpeechSynthesisUtterance(text);
                
                // Set proper language for the utterance
                const langCode = languages[currentLanguage]?.speechLang || 'en-US';
                utter.lang = langCode;
                
                // Wait for voices to load
                const speak = () => {
                  const voices = window.speechSynthesis.getVoices();
                  
                  // Try to find a voice for the selected language
                  const preferredVoice = voices.find(voice => 
                    voice.lang.startsWith(langCode.split('-')[0]) || 
                    voice.lang === langCode
                  );
                  
                  if (preferredVoice) {
                    utter.voice = preferredVoice;
                  }
                  
                  window.speechSynthesis.cancel();
                  window.speechSynthesis.speak(utter);
                };
                
                // Voices may not be loaded immediately
                if (window.speechSynthesis.getVoices().length > 0) {
                  speak();
                } else {
                  window.speechSynthesis.onvoiceschanged = speak;
                }
              }}
            >
              🔊 {t('common.readAloud')}
            </button>
          </div>
          <ul className="trust-list">
            <li>Real-time availability</li>
            <li>Secure & scalable</li>
            <li>Designed for hospitals & clinics</li>
          </ul>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="device-mock">
            <svg width="420" height="280" viewBox="0 0 720 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="App mockup">
              <rect fill="#E9F6FF" width="720" height="480"/>
              <rect x="40" y="40" rx="16" ry="16" width="320" height="400" fill="#fff" stroke="#D7EEF9"/>
              <rect x="360" y="40" rx="16" ry="16" width="320" height="400" fill="#fff" stroke="#D7EEF9"/>
              <text x="200" y="90" fontSize="22" fontFamily="Arial" fill="#20546C" textAnchor="middle">MediSync Mockup</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
