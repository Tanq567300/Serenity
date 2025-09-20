import React, { useState, useRef, useEffect } from 'react';
import AIService from './services/aiService.js';
import MoodTracker from './components/MoodTracker.jsx';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm here to support you. I'm just getting set up - please wait a moment while I load my resources.",
      sender: 'ai',
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelError, setModelError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize (Gemini is server-side; no model download)
  useEffect(() => {
    setModelError(null);
    setMessages([{
      id: 1,
      text: "Hello! I'm here to support you and chat about anything on your mind. How are you feeling today?",
      sender: 'ai',
      timestamp: Date.now()
    }]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading || !AIService.isModelReady()) return;

    const currentInput = inputText.trim();
    const userMessage = {
      id: Date.now(),
      text: currentInput,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const aiResponseText = await AIService.generateResponse(currentInput, messages);
      
      const aiResponse = {
        id: Date.now() + 1,
        text: aiResponseText,
        sender: 'ai',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorResponse = {
        id: Date.now() + 1,
        text: "I'm having trouble processing that right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clear any pending timeouts or intervals if needed
      setMessages([]);
    };
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isModelReady = AIService.isModelReady();

  const renderChatTab = () => (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        
        {isLoading && (
          <div className="message ai typing-indicator">
            Thinking...
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-container">
        <textarea
          className="message-input"
          placeholder={
            modelError ? "AI failed to respond. Try again." :
            !isModelReady ? "Connecting..." :
            "Type your message here..."
          }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading || isModelLoading || !isModelReady}
          rows={1}
        />
        <button
          className="send-button"
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isLoading || !isModelReady}
        >
          {isLoading ? 'Thinking...' : 
           modelError ? 'Error' : 
           !isModelReady ? 'Wait...' : 'Send'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="app">
      <div className="chat-header">
        <h1>Wellness Companion</h1>
        <p>Your private AI friend & mood tracker</p>
        
        {/* Status indicator for server-side Gemini */}
        {activeTab === 'chat' && (
          <>
            {modelError && (
              <div className="model-status error">
                ❌ Service issue: {modelError}
              </div>
            )}
            
            {isModelReady && (
              <div className="model-status ready">
                ✅ Connected to AI assistant
              </div>
            )}
          </>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          💬 Chat
        </button>
        <button 
          className={`nav-tab ${activeTab === 'mood' ? 'active' : ''}`}
          onClick={() => setActiveTab('mood')}
        >
          😊 Mood Tracker
        </button>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'chat' ? renderChatTab() : <MoodTracker />}
    </div>
  );
}

export default App;