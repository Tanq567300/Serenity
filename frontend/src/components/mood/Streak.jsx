import React from 'react';
import { SimpleIcons } from '../common/SimpleIcons';

const Streak = ({ streakData, trends }) => {
  const { type, days } = streakData;
  
  const getStreakColor = () => {
    if (days >= 7) return 'text-green-600 bg-green-50';
    if (days >= 3) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getStreakMessage = () => {
    if (days === 0) return "Start your wellness journey today!";
    if (type === 'positive' && days >= 7) return "Amazing streak! You're building great habits!";
    if (type === 'positive' && days >= 3) return "Great job maintaining positive moods!";
    if (type === 'positive') return "Keep up the good work!";
    if (type === 'negative' && days >= 3) return "Consider reaching out for support.";
    return "Every day is a new opportunity.";
  };

  const getTrendIcon = () => {
    if (trends.trend === 'improving') return <SimpleIcons.TrendingUp className="w-5 h-5 text-green-500" />;
    if (trends.trend === 'declining') return <SimpleIcons.TrendingDown className="w-5 h-5 text-red-500" />;
    return <SimpleIcons.TrendingFlat className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="space-y-4">
      {/* Streak Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getStreakColor()} mb-4`}>
          <SimpleIcons.Fire className="w-8 h-8" />
        </div>          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {days} {days === 1 ? 'Day' : 'Days'}
          </h3>
          
          <p className="text-sm text-gray-600 mb-2">
            {type === 'positive' ? 'Positive Streak' : 'Current Streak'}
          </p>
          
          <p className="text-sm text-gray-700">
            {getStreakMessage()}
          </p>
        </div>
      </div>

      {/* Trends Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Mood Trends</h3>
          {getTrendIcon()}
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Overall trend:</span>
            <span className={`text-sm font-medium capitalize ${
              trends.trend === 'improving' ? 'text-green-600' :
              trends.trend === 'declining' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {trends.trend}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Monthly average:</span>
            <span className="text-sm font-medium text-gray-900">
              {trends.monthAvg}/5
            </span>
          </div>
        </div>
      </div>

      {/* Insights */}
      {trends.insights && trends.insights.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights & Patterns</h3>
          
          <div className="space-y-3">
            {trends.insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <p className="text-sm text-blue-800 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Streak;
