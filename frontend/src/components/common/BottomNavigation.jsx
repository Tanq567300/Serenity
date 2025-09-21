import React from 'react';
import { SimpleIcons } from './SimpleIcons';

const BottomNavigation = ({ activeSection, onNavigate }) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: SimpleIcons.Home,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: SimpleIcons.Chat,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'mood',
      label: 'Mood',
      icon: SimpleIcons.Smile,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 lg:hidden">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 min-w-0 flex-1 mx-1 ${
                isActive 
                  ? `${item.color} ${item.bgColor}` 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <IconComponent className={`w-6 h-6 mb-1 ${isActive ? item.color : ''}`} />
              <span className={`text-xs font-medium truncate ${isActive ? item.color : ''}`}>
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