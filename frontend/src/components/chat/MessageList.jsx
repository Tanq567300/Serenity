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
    <div className="flex-1 overflow-y-auto p-3 lg:p-6 space-y-3 lg:space-y-4" style={{paddingTop: '20px', paddingLeft: '20px', paddingBottom: '20px', paddingRight: '20px'}}>
      {messages.length === 0 ? (
        <div className="text-center py-8 lg:py-12 px-4">
          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-indigo-600 rounded-full"></div>
          </div>
          <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
          <p className="text-sm lg:text-base text-gray-500 max-w-sm mx-auto">Your AI wellness companion is here to listen and support you.</p>
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
