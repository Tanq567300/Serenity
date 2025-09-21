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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map(action => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.action}
              className={`w-full flex items-center p-4 rounded-lg ${action.color} text-white transition-colors duration-200 group`}
            >
              <div className="flex-shrink-0 mr-4">
                <IconComponent className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-sm opacity-90">{action.description}</div>
              </div>
              <div className="ml-auto">
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
