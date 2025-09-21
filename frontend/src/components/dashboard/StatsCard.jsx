import React from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  MinusIcon 
} from '@heroicons/react/24/outline';

const StatsCard = ({ title, value, subtitle, trend, color = 'blue', icon: IconComponent }) => {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 text-blue-700 border-blue-200',
    green: 'from-green-50 to-green-100 text-green-700 border-green-200',
    purple: 'from-purple-50 to-purple-100 text-purple-700 border-purple-200',
    orange: 'from-orange-50 to-orange-100 text-orange-700 border-orange-200',
    red: 'from-red-50 to-red-100 text-red-700 border-red-200'
  };

  const iconBgColors = {
    blue: 'linear-gradient(135deg, #647FBC 0%, #91ADC8 100%)',
    green: 'linear-gradient(135deg, #AED6CF 0%, #91ADC8 100%)',
    purple: 'linear-gradient(135deg, #91ADC8 0%, #647FBC 100%)',
    orange: 'linear-gradient(135deg, #FAFDD6 0%, #AED6CF 100%)',
    red: 'linear-gradient(135deg, #647FBC 0%, #91ADC8 100%)'
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUpIcon className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <ArrowDownIcon className="w-4 h-4 text-red-500" />;
    return <MinusIcon className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div 
          className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl text-white shadow-md`}
          style={{ background: iconBgColors[color] }}
        >
          {IconComponent && <IconComponent className="w-5 h-5 lg:w-7 lg:h-7" />}
        </div>
        {trend && (
          <div className="flex items-center bg-gray-50 rounded-lg p-2">
            {getTrendIcon()}
          </div>
        )}
      </div>
      
      <div className="space-y-2 lg:space-y-3">
        <h3 className="text-sm lg:text-base font-semibold text-gray-600 uppercase tracking-wide">{title}</h3>
        <div className="text-xl lg:text-3xl font-bold text-gray-900">{value}</div>
        {subtitle && <p className="text-sm lg:text-base text-gray-500 leading-relaxed">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatsCard;
