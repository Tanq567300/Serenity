import React from 'react';
import { SimpleIcons } from '../common/SimpleIcons';

const QuickActions = ({ onNavigate }) => {
  const actions = [
    {
      id: 'chat',
      title: 'Start Chat Session',
      description: 'Talk to your AI wellness companion',
      icon: SimpleIcons.Chat,
      gradient: 'linear-gradient(135deg, #647FBC 0%, #91ADC8 100%)',
      action: () => onNavigate('chat')
    },
    {
      id: 'mood',
      title: 'Log Today\'s Mood',
      description: 'Quick mood check-in',
      icon: SimpleIcons.Smile,
      gradient: 'linear-gradient(135deg, #AED6CF 0%, #91ADC8 100%)',
      action: () => onNavigate('mood')
    },
    {
      id: 'journal',
      title: 'Write Journal Entry',
      description: 'Reflect on your day',
      icon: SimpleIcons.Chart,
      gradient: 'linear-gradient(135deg, #91ADC8 0%, #647FBC 100%)',
      action: () => onNavigate('mood')
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 lg:p-8">
      <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6">Quick Actions</h3>
      <div className="space-y-4">
        {actions.map(action => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.action}
              className="w-full flex items-center p-4 lg:p-5 rounded-xl text-white transition-all duration-300 group hover:shadow-lg transform hover:-translate-y-1"
              style={{ background: action.gradient }}
            >
              <div className="flex-shrink-0 mr-4 lg:mr-5 p-2 rounded-lg bg-white/20">
                <IconComponent className="w-6 h-6 lg:w-7 lg:h-7" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="font-semibold text-base lg:text-lg">{action.title}</div>
                <div className="text-sm lg:text-base opacity-90 mt-1">{action.description}</div>
              </div>
              <div className="ml-auto p-2">
                <svg className="w-5 h-5 lg:w-6 lg:h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
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
