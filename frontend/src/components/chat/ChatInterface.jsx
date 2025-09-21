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
    <div className="h-full flex flex-col bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="text-white p-3 lg:p-4" style={{backgroundColor: '#F39F9F'}}>
        <div className="flex items-center space-x-2 lg:space-x-3" style={{paddingLeft: '10px'}}>
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 rounded-full flex items-center justify-center">
            <SimpleIcons.Chat className="w-4 h-4 lg:w-6 lg:h-6" />
          </div>
          <div className="min-w-0 flex-1" style={{paddingLeft: '10px', paddingTop: '10px', paddingRight: '10px', paddingBottom: '10px'}}>
            <h3 className="font-semibold text-sm lg:text-base truncate">AI Wellness Companion</h3>
            <p className="text-xs lg:text-sm opacity-90 truncate">Here to listen and support you</p>
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
