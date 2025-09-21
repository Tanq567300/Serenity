import React from 'react';
import { SimpleIcons } from '../common/SimpleIcons';

const QuickActions = ({ onNavigate }) => {
  const actions = [
    {
      id: 'chat',
      title: 'Start Chat Session',
      description: 'Talk to your AI wellness companion',
      icon: SimpleIcons.Chat,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => onNavigate('chat')
    },
    {
      id: 'mood',
      title: 'Log Today\'s Mood',
      description: 'Quick mood check-in',
      icon: SimpleIcons.Smile,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => onNavigate('mood')
    },
    {
      id: 'journal',
      title: 'Write Journal Entry',
      description: 'Reflect on your day',
      icon: SimpleIcons.Chart, // Using chart as a substitute for document
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => onNavigate('mood') // For now, redirect to mood tracker
    }
  ];

  return (
    <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-3 lg:p-6">
      <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Quick Actions</h3>
      <div className="space-y-2 lg:space-y-3">
        {actions.map(action => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.action}
              className={`w-full flex items-center p-3 lg:p-4 rounded-md lg:rounded-lg ${action.color} text-white transition-colors duration-200 group`}
            >
              <div className="flex-shrink-0 mr-3 lg:mr-4">
                <IconComponent className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="font-medium text-sm lg:text-base truncate">{action.title}</div>
                <div className="text-xs lg:text-sm opacity-90 line-clamp-1">{action.description}</div>
              </div>
              <div className="ml-auto">
                <svg className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
