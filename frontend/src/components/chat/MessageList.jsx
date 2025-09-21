import React, { useEffect, useRef } from 'react';
import Message from './Message';

const MessageList = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-600 rounded-full"></div>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
          <p className="text-sm sm:text-base text-gray-500">Your AI wellness companion is here to listen and support you.</p>
        </div>
      ) : (
        <div>
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          
          {isLoading && <Message message={{}} isLoading />}
          
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessageList;
