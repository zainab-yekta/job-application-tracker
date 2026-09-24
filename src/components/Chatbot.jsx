import React, { useState, useRef, useEffect } from 'react';
import { getBotReply, GREETING } from '../utils/chatbotReplies';
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([{ sender: 'bot', text: GREETING }]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEnd = useRef(null);

  // Keep the newest message in view
  useEffect(() => {
    messagesEnd.current?.scrollIntoView?.({ block: 'nearest' });
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text },
      { sender: 'bot', text: getBotReply(text) },
    ]);
    setInput('');
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <button
        type="button"
        className="chatbot-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="chatbot-box"
      >
        💬 Chat with Bot
      </button>
      {isOpen && (
        <div className="chatbot-box" id="chatbot-box">
          <div className="chatbot-messages" aria-live="polite">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEnd} />
          </div>
          <form className="chatbot-input" onSubmit={handleSend}>
            <label className="sr-only" htmlFor="chatbot-message">
              Message
            </label>
            <input
              id="chatbot-message"
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
