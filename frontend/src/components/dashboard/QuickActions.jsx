import React from 'react';
import { SimpleIcons } from '../common/SimpleIcons';

const QuickActions = ({ onNavigate }) => {
  const actions = [
    {
      id: 'chat',
      title: 'Start Chat Session',
      description: 'Talk to your AI wellness companion',
      icon: SimpleIcons.Chat,
      color: '#FFECC0',
      action: () => onNavigate('chat')
    },
    {
      id: 'mood',
      title: 'Log Today\'s Mood',
      description: 'Quick mood check-in',
      icon: SimpleIcons.Smile,
      color: '#FFC29B',
      action: () => onNavigate('mood')
    },
    {
      id: 'journal',
      title: 'Write Journal Entry',
      description: 'Reflect on your day',
      icon: SimpleIcons.Chart,
      color: '#F39F9F',
      action: () => onNavigate('mood')
    }
  ];

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg border border-gray-100" 
      style={{ paddingTop: '10px', paddingLeft: '10px', paddingRight: '10px', paddingBottom: '10px' }}
    >
      <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-6 lg:mb-8">Quick Actions</h3>
      <div className="space-y-6" style={{ paddingRight: '20px' }}>
        {actions.map(action => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.action}
              className="w-full flex items-center p-6 lg:p-7 rounded-3xl text-gray-800 transition-all duration-200 group hover:shadow-md"
              style={{ background: action.color }}
            >
              <div className="flex-shrink-0 mr-6 lg:mr-7 p-3 rounded-xl bg-white/20">
                <IconComponent className="w-7 h-7 lg:w-8 lg:h-8" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="font-semibold text-lg lg:text-xl">{action.title}</div>
                <div className="text-base lg:text-lg opacity-90 mt-2">{action.description}</div>
              </div>
              <div className="ml-auto p-3">
                <svg className="w-6 h-6 lg:w-7 lg:h-7 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
