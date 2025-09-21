import React, { useState } from 'react';
import { SimpleIcons } from '../common/SimpleIcons';

const MessageInput = ({ onSendMessage, isLoading, isModelReady, modelError }) => {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim() || isLoading || !isModelReady) return;
    
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getPlaceholder = () => {
    if (modelError) return "AI service error. Please try again...";
    if (!isModelReady) return "Connecting to AI...";
    return "Type your message here...";
  };

  const getButtonText = () => {
    if (isLoading) return "Sending...";
    if (modelError) return "Error";
    if (!isModelReady) return "Wait...";
    return "Send";
  };

  return (
    <div className="border-t border-gray-200 bg-white p-3 lg:p-4">
      <div className="flex space-x-2 lg:space-x-4">
        <div className="flex-1" style={{paddingLeft: '20px', paddingTop: '20px', paddingRight: '20px', paddingBottom: '20px'}}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={getPlaceholder()}
            disabled={isLoading || !isModelReady}
            className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            rows={1}
            style={{
              minHeight: '40px',
              maxHeight: '120px'
            }}
          />
        </div>
        
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || isLoading || !isModelReady}
          className="flex-shrink-0 text-white p-2 lg:p-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center min-w-[40px] lg:min-w-[48px]"
          style={{
            backgroundColor: !inputText.trim() || isLoading || !isModelReady ? '#9CA3AF' : '#F39F9F'
          }}
          onMouseEnter={(e) => {
            if (!(!inputText.trim() || isLoading || !isModelReady)) {
              e.target.style.backgroundColor = '#E67E7E';
            }
          }}
          onMouseLeave={(e) => {
            if (!(!inputText.trim() || isLoading || !isModelReady)) {
              e.target.style.backgroundColor = '#F39F9F';
            }
          }}
        >
          {isLoading ? (
            <div className="w-4 h-4 lg:w-5 lg:h-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            <SimpleIcons.Send className="w-4 h-4 lg:w-5 lg:h-5" />
          )}
        </button>
      </div>
      
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500" style={{paddingLeft: '10px', paddingRight: '10px', paddingBottom: '10px'}}>
        <span className="hidden sm:inline">Press Enter to send, Shift+Enter for new line</span>
        <span className="sm:hidden">Enter to send</span>
        <span>{inputText.length}/1000</span>
      </div>
    </div>
  );
};

export default MessageInput;
