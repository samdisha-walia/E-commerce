import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './ChatBot.css';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content:
    "Hi! I'm your AI shopping buddy. Ask me about products, orders, or anything else I can help you with.",
};

const ChatBot = () => {
  const apiBaseUrl = useMemo(() => {
    const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
    return base || 'http://localhost:5000';
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
    setError('');
  };

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: updatedMessages,
        }),
      });

      if (!response.ok) {
        throw new Error('The assistant is unavailable. Please try again.');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || 'I am here to help.' }]);
    } catch (err) {
      console.error('Chat error', err);
      setError(err.message || 'Unable to reach the assistant right now.');
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl, input, isLoading, messages]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-wrapper">
      <button className="chatbot-toggle" type="button" onClick={toggleChat} aria-expanded={isOpen}>
        {isOpen ? '✕ Close Chat' : '💬 Chat with us'}
      </button>

      {isOpen && (
        <div className="chatbot-panel">
          <header className="chatbot-header">
            <div>
              <p className="chatbot-title">AI Shopping Assistant</p>
            </div>
          </header>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`chatbot-bubble ${message.role}`}>
                <span>{message.content}</span>
              </div>
            ))}
            {isLoading && <div className="chatbot-typing">Assistant is thinking…</div>}
            {error && <div className="chatbot-error">{error}</div>}
            <div ref={bottomRef} />
          </div>

          <div className="chatbot-input">
            <textarea
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
            />
            <button type="button" onClick={sendMessage} disabled={isLoading || !input.trim()}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
