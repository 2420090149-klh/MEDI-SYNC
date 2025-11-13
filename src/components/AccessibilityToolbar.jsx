import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function AccessibilityToolbar() {
  const { t } = useLanguage();
  const [largeFont, setLargeFont] = useState(() => {
    try { return localStorage.getItem('access_largeFont') === '1'; } catch { return false; }
  });
  const [highContrast, setHighContrast] = useState(() => {
    try { return localStorage.getItem('access_highContrast') === '1'; } catch { return false; }
  });
  const [fontScale, setFontScale] = useState(() => {
    try { return parseFloat(localStorage.getItem('access_fontScale')) || 1; } catch { return 1; }
  });

  // Speech voices
  const [voices, setVoices] = useState([]);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(() => {
    try { return localStorage.getItem('access_voice') || ''; } catch { return ''; }
  });
  const voiceRef = useRef(null);
  const utterRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVoiceName, setCurrentVoiceName] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast);
    localStorage.setItem('access_highContrast', highContrast ? '1' : '0');
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.classList.toggle('large-font', largeFont);
    document.documentElement.style.setProperty('--app-font-scale', String(fontScale));
    try { localStorage.setItem('access_largeFont', largeFont ? '1' : '0'); } catch {}
    try { localStorage.setItem('access_fontScale', String(fontScale)); } catch {}
  }, [largeFont, fontScale]);

  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices() || [];
      setVoices(v);
      // If no selected voice, try to pick a sensible default
      if (!selectedVoiceURI && v.length) {
        const preferred = v.find(x => x.lang && x.lang.startsWith((navigator.language||'en').split('-')[0]));
        setSelectedVoiceURI(preferred ? preferred.voiceURI : v[0].voiceURI);
      }
    };
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, [selectedVoiceURI]);

  useEffect(() => {
    try { localStorage.setItem('access_voice', selectedVoiceURI || ''); } catch {}
  }, [selectedVoiceURI]);

  const readMainContent = () => {
    const main = document.getElementById('main') || document.querySelector('main');
    let text = '';
    if (main) text = main.innerText;
    if (!text) text = document.body.innerText;
    const utter = new SpeechSynthesisUtterance(text.slice(0, 12000)); // limit size
    try { utter.lang = (navigator.language || 'en').split('-')[0]; } catch {}
    if (selectedVoiceURI) {
      const voice = voices.find(v => v.voiceURI === selectedVoiceURI) || voices.find(v => v.name === selectedVoiceURI);
      if (voice) utter.voice = voice;
    }
    // If already playing something, cancel it first
    if (utterRef.current) {
      try { window.speechSynthesis.cancel(); } catch {}
      utterRef.current = null;
    }
    utterRef.current = utter;
    utter.onstart = () => {
      setIsPlaying(true);
      setCurrentVoiceName((utter.voice && utter.voice.name) || (utter.lang || ''));
    };
    utter.onend = () => { setIsPlaying(false); utterRef.current = null; setCurrentVoiceName(''); };
    utter.onerror = () => { setIsPlaying(false); utterRef.current = null; setCurrentVoiceName(''); };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const playPauseMain = () => {
    const synth = window.speechSynthesis;
    if (!utterRef.current || (!isPlaying && synth.paused === false && synth.speaking === false)) {
      // start speaking
      const main = document.getElementById('main') || document.querySelector('main');
      let text = '';
      if (main) text = main.innerText;
      if (!text) text = document.body.innerText;
      const utter = new SpeechSynthesisUtterance(text.slice(0, 12000));
      if (selectedVoiceURI) {
        const voice = voices.find(v => v.voiceURI === selectedVoiceURI) || voices.find(v => v.name === selectedVoiceURI);
        if (voice) utter.voice = voice;
      }
      utter.onstart = () => {
        setIsPlaying(true);
        const vName = (utter.voice && utter.voice.name) || (utter.lang || '');
        setCurrentVoiceName(vName);
        // Announce to screen readers
        const ariaLive = document.getElementById('a11y-live-region');
        if (ariaLive) ariaLive.textContent = `Now playing: ${vName}`;
      };
      utter.onend = () => {
        setIsPlaying(false);
        utterRef.current = null;
        setCurrentVoiceName('');
        const ariaLive = document.getElementById('a11y-live-region');
        if (ariaLive) ariaLive.textContent = 'Playback stopped';
      };
      utter.onerror = () => {
        setIsPlaying(false);
        utterRef.current = null;
        setCurrentVoiceName('');
        const ariaLive = document.getElementById('a11y-live-region');
        if (ariaLive) ariaLive.textContent = 'Playback error';
      };
      utterRef.current = utter;
      synth.cancel();
      synth.speak(utter);
      return;
    }

    // If currently speaking, toggle pause/resume
    if (synth.speaking && !synth.paused) {
      try { synth.pause(); setIsPlaying(false); const ariaLive = document.getElementById('a11y-live-region'); if (ariaLive) ariaLive.textContent = 'Playback paused'; } catch(e) { console.warn(e); }
    } else if (synth.paused) {
      try { synth.resume(); setIsPlaying(true); const ariaLive = document.getElementById('a11y-live-region'); if (ariaLive) ariaLive.textContent = 'Playback resumed'; } catch(e) { console.warn(e); }
    }
  };

  const increaseFont = () => setFontScale(s => Math.min(1.6, +(s + 0.1).toFixed(2)));
  const decreaseFont = () => setFontScale(s => Math.max(0.8, +(s - 0.1).toFixed(2)));
  const resetFont = () => { setFontScale(1); setLargeFont(false); };

  return (
    <div className="accessibility-toolbar" role="region" aria-label={t('accessibility.toolbarLabel') || 'Accessibility toolbar'}>
      <div id="a11y-live-region" className="sr-only" role="status" aria-live="polite" aria-atomic="true"></div>
      <button 
        className="at-btn" 
        onClick={playPauseMain} 
        title={t('accessibility.playPause') || 'Play / Pause'} 
        aria-pressed={isPlaying}
        aria-label={isPlaying ? t('accessibility.pauseReading') || 'Pause reading' : t('accessibility.startReading') || 'Start reading'}
      >
        {isPlaying ? '❚❚' : '🔊'}
      </button>
      <div className={`waveform ${isPlaying ? 'playing' : ''}`} aria-hidden="true">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
      <div className="current-voice" aria-live="polite">{currentVoiceName ? `${t('accessibility.playing') || 'Playing:'} ${currentVoiceName}` : ''}</div>
      <div className="voice-selector-wrapper" ref={voiceRef}>
        <button className="at-btn" onClick={() => setVoiceOpen(v => !v)} title={t('accessibility.voice') || 'Voice'} aria-expanded={voiceOpen}>
          🎤
        </button>
        {voiceOpen && (
          <div className="voice-dropdown" role="dialog" aria-label={t('accessibility.selectVoice') || 'Select voice'}>
            <div className="voice-list">
              {voices.length === 0 && <div className="voice-empty">{t('accessibility.noVoices') || 'No voices available'}</div>}
              {voices.map(v => (
                <div key={v.voiceURI || v.name} className={`voice-item ${selectedVoiceURI === (v.voiceURI||v.name) ? 'active' : ''}`}>
                  <button
                    className="voice-select"
                    onClick={() => { setSelectedVoiceURI(v.voiceURI||v.name); setVoiceOpen(false); }}
                  >
                    <div className="voice-name">{v.name} <span className="voice-lang">{v.lang}</span></div>
                  </button>
                  <button
                    className="voice-sample-btn"
                    title={t('accessibility.playSample') || 'Play sample'}
                    onClick={(e) => {
                      e.stopPropagation();
                      const sampleText = t('accessibility.sampleText') || 'This is a sample of the selected voice.';
                      const utter = new SpeechSynthesisUtterance(sampleText);
                      if (v.voiceURI) {
                        const found = voices.find(x => x.voiceURI === v.voiceURI) || voices.find(x => x.name === v.name);
                        if (found) utter.voice = found;
                      }
                      try { utter.lang = v.lang || (navigator.language||'en').split('-')[0]; } catch {}
                      window.speechSynthesis.cancel();
                      window.speechSynthesis.speak(utter);
                    }}
                  >
                    ▶
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <button className="at-btn" onClick={increaseFont} title={t('accessibility.increaseFont') || 'Increase font'}>
        A+
      </button>
      <button className="at-btn" onClick={decreaseFont} title={t('accessibility.decreaseFont') || 'Decrease font'}>
        A-
      </button>
      <button className="at-btn" onClick={resetFont} title={t('accessibility.resetFont') || 'Reset font'}>
        ⟲
      </button>
      <button
        className={`at-btn ${highContrast ? 'active' : ''}`}
        onClick={() => setHighContrast(h => !h)}
        title={t('accessibility.highContrast') || 'Toggle high contrast'}
        aria-pressed={highContrast}
      >
        🌓
      </button>
      <button
        className={`at-btn ${largeFont ? 'active' : ''}`}
        onClick={() => setLargeFont(f => !f)}
        title={t('accessibility.toggleLarge') || 'Toggle large font'}
        aria-pressed={largeFont}
      >
        🔠
      </button>
    </div>
  );
}
