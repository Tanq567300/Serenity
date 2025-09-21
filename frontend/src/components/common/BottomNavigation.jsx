import React from 'react';
import { SimpleIcons } from './SimpleIcons';

const BottomNavigation = ({ activeSection, onNavigate }) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: SimpleIcons.Home,
      gradient: 'linear-gradient(135deg, #647FBC 0%, #91ADC8 100%)'
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: SimpleIcons.Chat,
      gradient: 'linear-gradient(135deg, #91ADC8 0%, #AED6CF 100%)'
    },
    {
      id: 'mood',
      label: 'Mood',
      icon: SimpleIcons.Smile,
      gradient: 'linear-gradient(135deg, #AED6CF 0%, #FAFDD6 100%)'
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
              className={`flex flex-col items-center justify-center py-3 px-4 rounded-xl transition-all duration-300 min-w-0 flex-1 mx-2 transform ${
                isActive 
                  ? 'text-white shadow-lg scale-105' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              style={isActive ? { background: item.gradient } : {}}
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