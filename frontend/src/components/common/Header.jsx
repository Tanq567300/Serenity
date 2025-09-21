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
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 lg:px-8 py-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div>
            <h1 className="text-xl lg:text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
            <p className="text-sm lg:text-base text-gray-600 mt-2 hidden sm:block">{getPageDescription()}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 lg:space-x-6">
          {activeTab === 'chat' && (
            <StatusIndicator isModelReady={isModelReady} modelError={modelError} />
          )}
          <div className="flex items-center space-x-3 px-4 lg:px-5 py-2 lg:py-3 rounded-xl text-sm lg:text-base font-medium text-white shadow-md" style={{ background: 'linear-gradient(135deg, #AED6CF 0%, #91ADC8 100%)' }}>
            <div className="w-3 h-3 bg-white rounded-full shadow-sm animate-pulse"></div>
            <span className="hidden sm:inline">Online</span>
            <span className="sm:hidden">●</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
