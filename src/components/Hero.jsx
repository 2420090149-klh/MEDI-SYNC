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
            <svg width="420" height="280" viewBox="0 0 720 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="MediSync Dashboard Preview">
              {/* Background */}
              <rect fill="#E9F6FF" width="720" height="480"/>
              
              {/* Left Card - Patient Dashboard */}
              <rect x="40" y="40" rx="16" ry="16" width="320" height="400" fill="#fff" stroke="#D7EEF9" strokeWidth="2"/>
              <text x="200" y="70" fontSize="18" fontWeight="bold" fontFamily="Arial" fill="#2563eb" textAnchor="middle">Patient Dashboard</text>
              
              {/* Appointments List */}
              <rect x="60" y="90" rx="8" ry="8" width="280" height="60" fill="#f0f9ff" stroke="#bfdbfe" strokeWidth="1"/>
              <circle cx="80" cy="120" r="15" fill="#3b82f6"/>
              <text x="105" y="115" fontSize="12" fontWeight="600" fontFamily="Arial" fill="#1e3a8a">Dr. Ramesh Kumar</text>
              <text x="105" y="130" fontSize="10" fontFamily="Arial" fill="#64748b">Cardiology • Today 10:00 AM</text>
              
              <rect x="60" y="160" rx="8" ry="8" width="280" height="60" fill="#f0f9ff" stroke="#bfdbfe" strokeWidth="1"/>
              <circle cx="80" cy="190" r="15" fill="#8b5cf6"/>
              <text x="105" y="185" fontSize="12" fontWeight="600" fontFamily="Arial" fill="#1e3a8a">Dr. Priya Sharma</text>
              <text x="105" y="200" fontSize="10" fontFamily="Arial" fill="#64748b">Dermatology • Tomorrow 2:30 PM</text>
              
              {/* Quick Actions */}
              <rect x="60" y="240" rx="8" ry="8" width="130" height="40" fill="#2563eb"/>
              <text x="125" y="265" fontSize="11" fontWeight="600" fontFamily="Arial" fill="#fff" textAnchor="middle">📅 Book Now</text>
              
              <rect x="210" y="240" rx="8" ry="8" width="130" height="40" fill="#8b5cf6"/>
              <text x="275" y="265" fontSize="11" fontWeight="600" fontFamily="Arial" fill="#fff" textAnchor="middle">🤖 AI Chat</text>
              
              {/* Stats */}
              <text x="125" y="320" fontSize="24" fontWeight="bold" fontFamily="Arial" fill="#2563eb" textAnchor="middle">8</text>
              <text x="125" y="340" fontSize="10" fontFamily="Arial" fill="#64748b" textAnchor="middle">Total Appointments</text>
              
              <text x="275" y="320" fontSize="24" fontWeight="bold" fontFamily="Arial" fill="#10b981" textAnchor="middle">3</text>
              <text x="275" y="340" fontSize="10" fontFamily="Arial" fill="#64748b" textAnchor="middle">Upcoming</text>
              
              {/* Right Card - Doctor Search */}
              <rect x="360" y="40" rx="16" ry="16" width="320" height="400" fill="#fff" stroke="#D7EEF9" strokeWidth="2"/>
              <text x="520" y="70" fontSize="18" fontWeight="bold" fontFamily="Arial" fill="#2563eb" textAnchor="middle">Find Doctors</text>
              
              {/* Search Bar */}
              <rect x="380" y="90" rx="8" ry="8" width="280" height="35" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1"/>
              <text x="395" y="112" fontSize="11" fontFamily="Arial" fill="#94a3b8">🔍 Search specialists...</text>
              
              {/* Doctor Cards */}
              <rect x="380" y="140" rx="8" ry="8" width="280" height="70" fill="#f0fdf4" stroke="#86efac" strokeWidth="1"/>
              <circle cx="405" cy="175" r="20" fill="#10b981"/>
              <text x="435" y="170" fontSize="12" fontWeight="600" fontFamily="Arial" fill="#166534">Dr. Venkat Rao</text>
              <text x="435" y="185" fontSize="9" fontFamily="Arial" fill="#15803d">General Physician</text>
              <rect x="570" y="165" rx="4" ry="4" width="80" height="20" fill="#10b981"/>
              <text x="610" y="179" fontSize="9" fontWeight="600" fontFamily="Arial" fill="#fff" textAnchor="middle">⭐ 4.8</text>
              
              <rect x="380" y="220" rx="8" ry="8" width="280" height="70" fill="#fef3f2" stroke="#fca5a5" strokeWidth="1"/>
              <circle cx="405" cy="255" r="20" fill="#ef4444"/>
              <text x="435" y="250" fontSize="12" fontWeight="600" fontFamily="Arial" fill="#7f1d1d">Dr. Srinivas Reddy</text>
              <text x="435" y="265" fontSize="9" fontFamily="Arial" fill="#991b1b">Neurologist</text>
              <rect x="570" y="245" rx="4" ry="4" width="80" height="20" fill="#ef4444"/>
              <text x="610" y="259" fontSize="9" fontWeight="600" fontFamily="Arial" fill="#fff" textAnchor="middle">⭐ 4.9</text>
              
              {/* Bottom Action */}
              <rect x="380" y="310" rx="8" ry="8" width="280" height="40" fill="url(#grad1)"/>
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor:'#667eea',stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'#764ba2',stopOpacity:1}} />
                </linearGradient>
              </defs>
              <text x="520" y="335" fontSize="12" fontWeight="600" fontFamily="Arial" fill="#fff" textAnchor="middle">🌐 Available in 6 Languages</text>
              
              {/* Bottom Label */}
              <text x="360" y="470" fontSize="14" fontWeight="600" fontFamily="Arial" fill="#2563eb">Real-time Booking • Multi-language • AI Powered</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
