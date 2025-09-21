import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { SimpleIcons } from '../common/SimpleIcons';

const ChatInterface = ({ 
  messages, 
  onSendMessage, 
  isLoading, 
  isModelReady, 
  modelError 
}) => {
  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <SimpleIcons.Chat className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">AI Wellness Companion</h3>
            <p className="text-sm opacity-90">Here to listen and support you</p>
          </div>
        </div>
      </div>
      
      {/* Messages Area */}
      <MessageList messages={messages} isLoading={isLoading} />
      
      {/* Input Area */}
      <MessageInput 
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        isModelReady={isModelReady}
        modelError={modelError}
      />
    </div>
  );
};

export default ChatInterface;
