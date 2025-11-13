import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/ChatBot.css';

// Symptom to specialty mapping
const symptomMapping = {
  // General symptoms
  fever: ['General Physician', 'Internal Medicine'],
  cold: ['General Physician', 'ENT Specialist'],
  cough: ['General Physician', 'Pulmonologist'],
  headache: ['Neurologist', 'General Physician'],
  
  // Specific conditions
  chest_pain: ['Cardiologist', 'Emergency Medicine'],
  heart: ['Cardiologist'],
  breathing: ['Pulmonologist', 'Cardiologist'],
  stomach: ['Gastroenterologist', 'General Physician'],
  diabetes: ['Endocrinologist', 'Diabetologist'],
  sugar: ['Endocrinologist', 'Diabetologist'],
  
  // Body parts
  eye: ['Ophthalmologist'],
  ear: ['ENT Specialist'],
  nose: ['ENT Specialist'],
  throat: ['ENT Specialist'],
  skin: ['Dermatologist'],
  bone: ['Orthopedic'],
  joint: ['Orthopedic', 'Rheumatologist'],
  tooth: ['Dentist'],
  dental: ['Dentist'],
  
  // Mental health
  depression: ['Psychiatrist', 'Psychologist'],
  anxiety: ['Psychiatrist', 'Psychologist'],
  stress: ['Psychiatrist', 'Psychologist'],
  mental: ['Psychiatrist', 'Psychologist'],
  
  // Women's health
  pregnancy: ['Gynecologist', 'Obstetrician'],
  period: ['Gynecologist'],
  
  // Children
  child: ['Pediatrician'],
  baby: ['Pediatrician'],
  vaccination: ['Pediatrician'],
};

const greetings = {
  en: {
    welcome: "👋 Hello! I'm MediBot, your healthcare assistant.",
    askSymptom: "Tell me about your symptoms, and I'll suggest the right specialist for you.",
    placeholder: "Describe your symptoms...",
    suggestions: "Based on your symptoms, I recommend consulting:",
    noMatch: "I couldn't identify specific symptoms. Please consult a General Physician or describe your symptoms more clearly.",
    typing: "MediBot is typing...",
  },
  hi: {
    welcome: "👋 नमस्ते! मैं मेडीबोट हूं, आपका स्वास्थ्य सहायक।",
    askSymptom: "मुझे अपने लक्षणों के बारे में बताएं, और मैं आपको सही विशेषज्ञ सुझाऊंगा।",
    placeholder: "अपने लक्षण बताएं...",
    suggestions: "आपके लक्षणों के आधार पर, मैं सुझाव देता हूं:",
    noMatch: "मैं विशिष्ट लक्षण पहचान नहीं पाया। कृपया सामान्य चिकित्सक से परामर्श करें।",
    typing: "मेडीबोट टाइप कर रहा है...",
  },
  te: {
    welcome: "👋 నమస్కారం! నేను మెడీబాట్, మీ ఆరోగ్య సహాయకుడిని.",
    askSymptom: "మీ లక్షణాల గురించి చెప్పండి, నేను సరైన నిపుణుడిని సూచిస్తాను.",
    placeholder: "మీ లక్షణాలను వివరించండి...",
    suggestions: "మీ లక్షణాల ఆధారంగా, నేను సిఫార్సు చేస్తున్నాను:",
    noMatch: "నేను నిర్దిష్ట లక్షణాలను గుర్తించలేకపోయాను। దయచేసి సాధారణ వైద్యుడిని సంప్రదించండి।",
    typing: "మెడీబాట్ టైప్ చేస్తోంది...",
  },
  ta: {
    welcome: "👋 வணக்கம்! நான் மெடிபாட், உங்கள் சுகாதார உதவியாளர்.",
    askSymptom: "உங்கள் அறிகுறிகளைப் பற்றி சொல்லுங்கள், நான் சரியான நிபுணரை பரிந்துரைப்பேன்.",
    placeholder: "உங்கள் அறிகுறிகளை விவரிக்கவும்...",
    suggestions: "உங்கள் அறிகுறிகளின் அடிப்படையில், நான் பரிந்துரைக்கிறேன்:",
    noMatch: "குறிப்பிட்ட அறிகுறிகளை அடையாளம் காண முடியவில்லை। பொது மருத்துவரை அணுகவும்.",
    typing: "மெடிபாட் தட்டச்சு செய்கிறது...",
  },
  kn: {
    welcome: "👋 ನಮಸ್ಕಾರ! ನಾನು ಮೆಡಿಬಾಟ್, ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಹಾಯಕ.",
    askSymptom: "ನಿಮ್ಮ ಲಕ್ಷಣಗಳ ಬಗ್ಗೆ ಹೇಳಿ, ನಾನು ಸರಿಯಾದ ತಜ್ಞರನ್ನು ಸೂಚಿಸುತ್ತೇನೆ.",
    placeholder: "ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ...",
    suggestions: "ನಿಮ್ಮ ಲಕ್ಷಣಗಳ ಆಧಾರದ ಮೇಲೆ, ನಾನು ಶಿಫಾರಸು ಮಾಡುತ್ತೇನೆ:",
    noMatch: "ನಿರ್ದಿಷ್ಟ ಲಕ್ಷಣಗಳನ್ನು ಗುರುತಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಸಾಮಾನ್ಯ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    typing: "ಮೆಡಿಬಾಟ್ ಟೈಪ್ ಮಾಡುತ್ತಿದೆ...",
  },
  bho: {
    welcome: "👋 नमस्कार! हम मेडीबोट हई, रउआ के स्वास्थ्य सहायक।",
    askSymptom: "अपना लच्छन बतावs, आ हम सही विशेषज्ञ सुझाव देब।",
    placeholder: "अपना लच्छन बतावs...",
    suggestions: "रउआ के लच्छन के आधार पर, हम सुझाव देत बानी:",
    noMatch: "हम खास लच्छन ना पहचान पइनी। कृपया सामान्य डॉक्टर से सलाह लेवs।",
    typing: "मेडीबोट टाइप करत बा...",
  }
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { currentLanguage } = useLanguage();

  const texts = greetings[currentLanguage] || greetings.en;

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setTimeout(() => {
        setMessages([
          {
            type: 'bot',
            text: texts.welcome,
          },
          {
            type: 'bot',
            text: texts.askSymptom,
          }
        ]);
      }, 500);
    }
  }, [isOpen, messages.length, texts]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const analyzeSymptomsAndSuggest = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    const matchedSpecialties = new Set();

    // Check for symptom keywords
    Object.entries(symptomMapping).forEach(([keyword, specialists]) => {
      if (lowerInput.includes(keyword)) {
        specialists.forEach(spec => matchedSpecialties.add(spec));
      }
    });

    if (matchedSpecialties.size === 0) {
      return {
        text: texts.noMatch,
        specialists: ['General Physician']
      };
    }

    return {
      text: texts.suggestions,
      specialists: Array.from(matchedSpecialties)
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking time
    setTimeout(() => {
      const analysis = analyzeSymptomsAndSuggest(input);
      
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          text: analysis.text,
          specialists: analysis.specialists
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className={`chat-bot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Chat Assistant"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-bot-window">
          <div className="chat-bot-header">
            <div className="header-content">
              <span className="bot-avatar">🤖</span>
              <div>
                <h3>MediBot AI</h3>
                <span className="status">Online</span>
              </div>
            </div>
            <button
              className="close-chat"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="chat-bot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.type}`}>
                {msg.type === 'bot' && <span className="message-avatar">🤖</span>}
                <div className="message-content">
                  <p>{msg.text}</p>
                  {msg.specialists && (
                    <div className="specialists-list">
                      {msg.specialists.map((spec, i) => (
                        <div key={i} className="specialist-chip">
                          👨‍⚕️ {spec}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message bot typing">
                <span className="message-avatar">🤖</span>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-bot-input">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={texts.placeholder}
              rows="2"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
