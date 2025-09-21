import React from 'react';

const Message = ({ message, isLoading = false }) => {
  const isUser = message.sender === 'user';
  
  if (isLoading) {
    return (
      <div className="flex items-start space-x-2 lg:space-x-3 mb-3 lg:mb-4">
        <div className="flex-shrink-0 w-6 h-6 lg:w-8 lg:h-8 bg-indigo-100 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 lg:w-4 lg:h-4 bg-indigo-600 rounded-full"></div>
        </div>
        <div className="flex-1">
          <div className="bg-gray-100 rounded-lg px-3 py-2 lg:px-4 lg:py-3 max-w-xs">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start space-x-2 lg:space-x-3 mb-3 lg:mb-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-indigo-600' : 'bg-gray-200'
      }`}>
        {isUser ? (
          <span className="text-white text-xs lg:text-sm font-semibold">U</span>
        ) : (
          <div className="w-3 h-3 lg:w-4 lg:h-4 bg-indigo-600 rounded-full"></div>
        )}
      </div>
      
      <div className="flex-1 max-w-[75%] lg:max-w-xs xl:max-w-md" style={{paddingLeft: '10px'}}>
        <div className={`rounded-lg px-3 py-2 lg:px-4 lg:py-3 ${
          isUser 
            ? 'bg-indigo-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`} style={{
          paddingTop: '10px', 
          paddingLeft: '10px', 
          paddingRight: '10px', 
          paddingBottom: '10px',
          ...(isUser && { marginRight: '10px' })
        }}>
          <p className="text-xs lg:text-sm leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
        </div>
        
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
};

export default Message;
