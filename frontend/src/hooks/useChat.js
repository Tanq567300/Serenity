import { useState, useEffect } from 'react';
import AIService from '../services/aiService';

const useChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm here to support you and chat about anything on your mind. How are you feeling today?",
      sender: 'ai',
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelError, setModelError] = useState(null);

  // Initialize AI service
  useEffect(() => {
    setModelError(null);
  }, []);

  const sendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading || !AIService.isModelReady()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponseText = await AIService.generateResponse(messageText, messages);
      
      const aiResponse = {
        id: Date.now() + 1,
        text: aiResponseText,
        sender: 'ai',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setModelError(error.message || 'Failed to get AI response');
      
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

  const clearMessages = () => {
    setMessages([{
      id: 1,
      text: "Hello! I'm here to support you and chat about anything on your mind. How are you feeling today?",
      sender: 'ai',
      timestamp: Date.now()
    }]);
  };

  const getStats = () => {
    const sessionCount = Math.floor(messages.length / 4); // Rough estimate
    const lastSession = messages.length > 2 ? 'Today' : null;
    
    return {
      sessions: sessionCount,
      lastSession,
      messageCount: messages.length
    };
  };

  return {
    messages,
    isLoading,
    isModelLoading,
    modelError,
    isModelReady: AIService.isModelReady(),
    sendMessage,
    clearMessages,
    getStats
  };
};

export default useChat;
