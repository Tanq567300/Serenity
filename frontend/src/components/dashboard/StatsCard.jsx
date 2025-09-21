import React from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  MinusIcon 
} from '@heroicons/react/24/outline';

const StatsCard = ({ title, value, subtitle, trend, color = 'blue', icon: IconComponent }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    red: 'bg-red-50 text-red-700 border-red-200'
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUpIcon className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <ArrowDownIcon className="w-4 h-4 text-red-500" />;
    return <MinusIcon className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-3 lg:p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-2 lg:mb-4">
        <div className={`p-1.5 lg:p-2 rounded-md lg:rounded-lg ${colorClasses[color]}`}>
          {IconComponent && <IconComponent className="w-4 h-4 lg:w-6 lg:h-6" />}
        </div>
        {trend && (
          <div className="flex items-center">
            {getTrendIcon()}
          </div>
        )}
      </div>
      
      <div className="space-y-1 lg:space-y-2">
        <h3 className="text-xs lg:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">{title}</h3>
        <div className="text-lg lg:text-2xl font-bold text-gray-900 truncate">{value}</div>
        {subtitle && <p className="text-xs lg:text-sm text-gray-500 line-clamp-2">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatsCard;
