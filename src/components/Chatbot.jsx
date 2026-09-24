// components/Chatbot.js
import React, { useState } from 'react';
import './Chatbot.css';

const chatbotData = {
  "hello": "Hi there! How can I assist you today?",
  "how to use this app": "Just login, add jobs, track status, and view analytics.",
  "what is this app": "This is a Job Application Tracker to manage your job search.",
  "thanks": "You're welcome! 😊",
  "bye": "Goodbye! Have a great day!"
};

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    const lowerInput = input.toLowerCase();
    const botReply = chatbotData[lowerInput] || "Sorry, I don't understand that.";

    const botMessage = { sender: 'bot', text: botReply };

    setMessages([...messages, userMessage, botMessage]);
    setInput('');
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <div className="chatbot-header" onClick={() => setIsOpen(!isOpen)}>
        💬 Chat with Bot
      </div>
      {isOpen && (
        <div className="chatbot-box">
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
