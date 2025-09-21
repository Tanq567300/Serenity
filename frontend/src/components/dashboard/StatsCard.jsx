import React from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  MinusIcon 
} from '@heroicons/react/24/outline';

const StatsCard = ({ title, value, subtitle, trend, color = 'blue', icon: IconComponent }) => {
  const colorClasses = {
    blue: 'text-gray-700 border-gray-200',
    green: 'text-gray-700 border-gray-200',
    purple: 'text-gray-700 border-gray-200',
    orange: 'text-gray-700 border-gray-200',
    red: 'text-gray-700 border-gray-200'
  };

  const cardBackgrounds = {
    blue: '#FFECC0',    // Primary Cream
    green: '#FFC29B',   // Warm Orange
    purple: '#F39F9F',  // Coral Pink
    orange: '#B95E82',  // Deep Rose
    red: '#F39F9F'      // Coral Pink
  };

  const iconBgColors = {
    blue: '#FFECC0',
    green: '#FFC29B',
    purple: '#F39F9F',
    orange: '#B95E82',
    red: '#F39F9F'
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUpIcon className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <ArrowDownIcon className="w-4 h-4 text-red-500" />;
    return <MinusIcon className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div 
      className="rounded-2xl lg:rounded-3xl shadow-lg border border-gray-100 hover:shadow-lg transition-all duration-200"
      style={{ 
        paddingTop: '20px', 
        paddingLeft: '20px', 
        paddingRight: '20px', 
        paddingBottom: '20px',
        backgroundColor: cardBackgrounds[color]
      }}
    >
      <div className="flex items-center justify-between mb-8 lg:mb-12">
        {trend && (
          <div className="flex items-center bg-gray-50 rounded-xl p-4">
            {getTrendIcon()}
          </div>
        )}
      </div>
      
      <div className="space-y-4 lg:space-y-6">
        <h3 className="text-sm lg:text-lg font-semibold text-gray-600 uppercase tracking-wide">{title}</h3>
        <div className="text-2xl lg:text-4xl font-bold text-gray-900">{value}</div>
        {subtitle && <p className="text-base lg:text-lg text-gray-500 leading-relaxed">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatsCard;
