import React from 'react';
import StatusIndicator from './StatusIndicator';

const Header = ({ activeTab, isModelReady, modelError, onMenuToggle }) => {
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
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">{getPageDescription()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          {activeTab === 'chat' && (
            <StatusIndicator isModelReady={isModelReady} modelError={modelError} />
          )}
          <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
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
