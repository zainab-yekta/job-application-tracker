import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { getBotReply, GREETING } from '../utils/chatbotReplies';
import './Chatbot.css';

// Questions people can ask with one tap
const QUICK_QUESTIONS = [
  'How do I add a job?',
  'Interview reminders',
  'How do I export?',
  'Where is my data stored?',
];

function Chatbot() {
  const [messages, setMessages] = useState([{ sender: 'bot', text: GREETING }]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEnd = useRef(null);
  const inputRef = useRef(null);
  const toggleRef = useRef(null);

  // Keep the newest message in view
  useEffect(() => {
    messagesEnd.current?.scrollIntoView?.({ block: 'nearest' });
  }, [messages, isOpen]);

  // Escape closes the panel and puts focus back on the chat button
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const open = () => setIsOpen(true);

  // Put the cursor in the message box as soon as the panel opens
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    toggleRef.current?.focus();
  };

  const ask = (text) => {
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text },
      { sender: 'bot', text: getBotReply(text) },
    ]);
  };

  const handleSend = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    ask(text);
    setInput('');
  };

  // Offer the quick questions until the visitor has asked something
  const showQuickQuestions = messages.length === 1;

  return (
    <div className="chatbot">
      {isOpen && (
        <section className="chatbot-panel card" id="chatbot-panel" aria-label="Help chat">
          <header className="chatbot-header">
            <span className="chatbot-avatar" aria-hidden="true">
              <MessageCircle size={18} />
            </span>
            <div>
              <h2>Help</h2>
              <p>Quick answers about JobTracker</p>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-icon chatbot-close"
              onClick={close}
              aria-label="Close help chat"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div className="chatbot-messages" aria-live="polite">
            {messages.map((msg, index) => (
              <p key={index} className={`message message-${msg.sender}`}>
                <span className="sr-only">
                  {msg.sender === 'bot' ? 'Help says: ' : 'You said: '}
                </span>
                {msg.text}
              </p>
            ))}
            {showQuickQuestions && (
              <div className="quick-questions">
                {QUICK_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    type="button"
                    className="quick-question"
                    onClick={() => ask(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          <form className="chatbot-form" onSubmit={handleSend}>
            <label className="sr-only" htmlFor="chatbot-message">
              Message
            </label>
            <input
              ref={inputRef}
              id="chatbot-message"
              className="input"
              type="text"
              placeholder="Ask a question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" className="btn btn-primary btn-icon" aria-label="Send">
              <Send size={18} aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      <button
        ref={toggleRef}
        type="button"
        className="chatbot-toggle"
        onClick={isOpen ? close : open}
        aria-expanded={isOpen}
        aria-controls="chatbot-panel"
        aria-label={isOpen ? 'Close help chat' : 'Open help chat'}
      >
        {isOpen ? (
          <X size={24} aria-hidden="true" />
        ) : (
          <MessageCircle size={24} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

export default Chatbot;
