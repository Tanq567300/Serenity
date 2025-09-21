import React from 'react';
import StatusIndicator from './StatusIndicator';

const Header = ({ activeTab, isModelReady, modelError }) => {
  const getPageTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'chat': return 'AI Assistant';
      case 'mood': return 'Mood Tracker';
      default: return 'Sereni AI';
    }
  };

  const getPageDescription = () => {
    switch(activeTab) {
      case 'dashboard': return 'Your mental wellness insights at a glance';
      case 'chat': return 'Chat with your AI wellness companion';
      case 'mood': return 'Track and analyze your daily mood patterns';
      default: return 'Mental wellness platform';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div>
            <h1 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">{getPageTitle()}</h1>
            <p className="text-xs lg:text-sm text-gray-600 mt-1 hidden sm:block">{getPageDescription()}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
          {activeTab === 'chat' && (
            <StatusIndicator isModelReady={isModelReady} modelError={modelError} />
          )}
          <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="hidden sm:inline">Online</span>
            <span className="sm:hidden">●</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
