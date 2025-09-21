import React from 'react';
import { SimpleIcons } from './SimpleIcons';

const BottomNavigation = ({ activeSection, onNavigate }) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: SimpleIcons.Home,
      activeColor: '#FFC29B' // Warm Orange
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: SimpleIcons.Chat,
      activeColor: '#F39F9F' // Coral Pink
    },
    {
      id: 'mood',
      label: 'Mood',
      icon: SimpleIcons.Smile,
      activeColor: '#B95E82' // Deep Rose
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 z-50 lg:hidden shadow-lg">
      <div className="flex justify-around items-center py-3">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-3 px-4 rounded-xl transition-all duration-200 min-w-0 flex-1 mx-2 transform ${
                isActive 
                  ? 'text-white shadow-md scale-105' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              style={isActive ? { backgroundColor: item.activeColor } : {}}
            >
              <IconComponent className="w-7 h-7 mb-2" />
              <span className="text-xs font-semibold">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;