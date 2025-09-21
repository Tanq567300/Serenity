import React from 'react';
import { SimpleIcons } from './SimpleIcons';

const Sidebar = ({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: SimpleIcons.Home,
      description: 'Overview & insights'
    },
    { 
      id: 'chat', 
      label: 'AI Assistant', 
      icon: SimpleIcons.Chat,
      description: 'Chat support'
    },
    { 
      id: 'mood', 
      label: 'Mood Tracker', 
      icon: SimpleIcons.Smile,
      description: 'Daily check-ins'
    }
  ];

  const handleMenuItemClick = (tabId) => {
    setActiveTab(tabId);
    // Close mobile menu when item is clicked
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-gradient-to-b from-indigo-600 via-purple-600 to-purple-700 
        text-white flex flex-col h-screen shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Sereni AI</h2>
              <p className="text-purple-200 text-sm mt-1">Mental Wellness Platform</p>
            </div>
            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-4">
          {menuItems.map(item => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                className={`w-full flex items-center px-6 py-3 text-left transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/20 border-r-4 border-white text-white' 
                    : 'text-purple-200 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => handleMenuItemClick(item.id)}
              >
                <IconComponent className="w-5 h-5 mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium truncate">{item.label}</div>
                  <div className="text-xs opacity-75 truncate">{item.description}</div>
                </div>
              </button>
            );
          })}
        </nav>
        
        {/* Footer */}
        <div className="p-6 border-t border-purple-500/30">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-sm font-semibold">U</span>
            </div>
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">Anonymous User</div>
              <div className="text-xs text-purple-200 truncate">Privacy Protected</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;