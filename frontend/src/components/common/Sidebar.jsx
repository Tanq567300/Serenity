import React from 'react';
import { SimpleIcons } from './SimpleIcons';

const Sidebar = ({ activeTab, setActiveTab }) => {
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

  return (
    <div className="w-64 bg-gradient-to-b from-indigo-600 via-purple-600 to-purple-700 text-white flex flex-col h-screen shadow-xl">
      <div className="p-6 border-b border-purple-500/30">
        <h2 className="text-xl font-bold">Sereni AI</h2>
        <p className="text-purple-200 text-sm mt-1">Mental Wellness Platform</p>
      </div>
      
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
              onClick={() => setActiveTab(item.id)}
            >
              <IconComponent className="w-5 h-5 mr-3" />
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-xs opacity-75">{item.description}</div>
              </div>
            </button>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-purple-500/30">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm font-semibold">U</span>
          </div>
          <div>
            <div className="font-medium text-sm">Anonymous User</div>
            <div className="text-xs text-purple-200">Privacy Protected</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;