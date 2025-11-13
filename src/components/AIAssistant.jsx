import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your MediSync assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { t } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsTyping(true);

    try {
      // TODO: Replace with actual API call
      const response = await fetch('https://api.medisync.com/v1/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('medisync_token')}`
        },
        body: JSON.stringify({
          message: input
        })
      });

      const data = await response.json();
      
      // Add AI response
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Text-to-speech for accessibility
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; // TODO: Match with selected language
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      <button
        className={`ai-assistant-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Assistant"
      >
        <img src="/icons/ai-assistant.svg" alt="" />
      </button>

      <div className={`ai-assistant-panel ${isOpen ? 'open' : ''}`}>
        <div className="ai-assistant-header">
          <h3>AI Assistant</h3>
          <button onClick={() => setIsOpen(false)} className="close-button">
            ×
          </button>
        </div>

        <div className="messages-container">
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`message ${message.role}`}
              onClick={() => speak(message.content)}
            >
              {message.role === 'assistant' && (
                <img src="/icons/ai-avatar.svg" alt="" className="ai-avatar" />
              )}
              <div className="message-content">
                {message.content}
                <button 
                  className="speak-button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(message.content);
                  }}
                  aria-label="Read message aloud"
                >
                  🔊
                </button>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message assistant">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="message-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            aria-label="Message input"
          />
          <button type="submit" disabled={!input.trim() || isTyping}>
            Send
          </button>
        </form>
      </div>
    </>
  );
}