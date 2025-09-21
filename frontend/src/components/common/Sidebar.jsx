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
    /* Desktop Sidebar - Hidden on mobile */
    <div 
      className="hidden lg:flex w-72 text-white flex-col h-screen shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #647FBC 0%, #91ADC8 50%, #AED6CF 100%)',
        backgroundImage: 'linear-gradient(135deg, #647FBC 0%, #91ADC8 50%, #AED6CF 100%)'
      }}
    >
      {/* Header */}
      <div className="p-8 border-b border-white/20">
        <h2 className="text-2xl font-bold text-white">Sereni AI</h2>
        <p className="text-white/80 text-base mt-2">Mental Wellness Platform</p>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 py-6">
        {menuItems.map(item => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              className={`w-full flex items-center px-8 py-4 text-left transition-all duration-300 mx-4 rounded-xl mb-2 ${
                isActive 
                  ? 'bg-white/25 text-white shadow-lg transform scale-105' 
                  : 'text-white/80 hover:bg-white/15 hover:text-white hover:transform hover:translate-x-2'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <IconComponent className="w-6 h-6 mr-4" />
              <div>
                <div className="font-semibold text-lg">{item.label}</div>
                <div className="text-sm opacity-75 mt-1">{item.description}</div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
