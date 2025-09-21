import React from 'react';
import StatusIndicator from './StatusIndicator';

const Header = ({ activeTab, isModelReady, modelError }) => {
  const getPageTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'chat': return 'AI Assistant';
      case 'mood': return 'Mood Tracker';
      default: return 'Mansik';
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
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 px-8 lg:px-12 py-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-900">{getPageTitle()}</h1>
            <p className="text-base lg:text-xl text-gray-600 mt-3 hidden sm:block">{getPageDescription()}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 lg:space-x-8">
          {activeTab === 'chat' && (
            <StatusIndicator isModelReady={isModelReady} modelError={modelError} />
          )}
          <div className="flex items-center space-x-4 px-6 lg:px-7 py-3 lg:py-4 rounded-2xl text-base lg:text-lg font-medium text-white shadow-md" style={{ background: 'linear-gradient(135deg, #AED6CF 0%, #91ADC8 100%)' }}>
            <div className="w-4 h-4 bg-white rounded-full shadow-sm animate-pulse"></div>
            <span className="hidden sm:inline">Online</span>
            <span className="sm:hidden">●</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
