import React from 'react';

const MoodChart = ({ chartData, viewPeriod, onPeriodChange }) => {
  const formatChartDate = (dateString, period) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateString === today.toISOString().split('T')[0]) {
      return period === 'week' ? 'Today' : 'T';
    } else if (dateString === yesterday.toISOString().split('T')[0]) {
      return period === 'week' ? 'Yesterday' : 'Y';
    } else {
      if (period === 'week') {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      } else {
        return date.getDate().toString();
      }
    }
  };

  const getMoodColor = (moodValue) => {
    if (moodValue >= 4) return 'bg-green-500';
    if (moodValue >= 3) return 'bg-yellow-500';
    if (moodValue >= 2) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getMoodEmoji = (moodValue) => {
    if (moodValue >= 5) return '😁';
    if (moodValue >= 4) return '😊';
    if (moodValue >= 3) return '😐';
    if (moodValue >= 2) return '😟';
    return '😰';
  };

  return (
    <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900">Your Mood Journey</h3>
        
        {/* View Period Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            className={`px-2 lg:px-3 py-1 rounded-md text-xs lg:text-sm font-medium transition-colors ${
              viewPeriod === 'week'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => onPeriodChange('week')}
          >
            7 Days
          </button>
          <button
            className={`px-2 lg:px-3 py-1 rounded-md text-xs lg:text-sm font-medium transition-colors ${
              viewPeriod === 'month'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => onPeriodChange('month')}
          >
            30 Days
          </button>
        </div>
      </div>
      
      {/* Chart */}
      <div className="space-y-3 lg:space-y-4">
        <div className="flex items-end justify-between h-32 lg:h-40 bg-gray-50 rounded-lg p-3 lg:p-4">
          {chartData.map((dataPoint, index) => {
            const hasData = dataPoint.hasEntry && dataPoint.mood;
            const moodValue = dataPoint.mood || 0;
            
            return (
              <div key={`${dataPoint.date}-${index}`} className="flex flex-col items-center flex-1">
                <div className="flex flex-col items-center justify-end h-full mb-1 lg:mb-2">
                  {hasData ? (
                    <div 
                      className={`w-4 lg:w-6 rounded-t-sm ${getMoodColor(moodValue)} transition-all duration-300 hover:opacity-80`}
                      style={{
                        height: `${(moodValue / 5) * 100}%`,
                        minHeight: '6px'
                      }}
                      title={`${formatChartDate(dataPoint.date, viewPeriod)}: ${getMoodEmoji(moodValue)} (${moodValue}/5)${dataPoint.note ? ` - "${dataPoint.note}"` : ''}`}
                    ></div>
                  ) : (
                    <div 
                      className="w-4 lg:w-6 h-1.5 lg:h-2 bg-gray-200 rounded-sm"
                      title={`${formatChartDate(dataPoint.date, viewPeriod)}: No entry`}
                    ></div>
                  )}
                </div>
                
                <div className="text-center">
                  <div className="text-sm lg:text-lg mb-0.5 lg:mb-1">
                    {hasData ? getMoodEmoji(moodValue) : '⭕'}
                  </div>
                  <div className="text-xs text-gray-600">
                    {formatChartDate(dataPoint.date, viewPeriod)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Mood Scale Legend */}
        <div className="grid grid-cols-2 lg:flex lg:items-center lg:justify-center gap-2 lg:gap-6 text-xs text-gray-600 bg-gray-50 rounded-lg p-2 lg:p-3">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 lg:w-3 lg:h-3 bg-red-500 rounded-sm"></div>
            <span className="truncate">Very Low (1)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 lg:w-3 lg:h-3 bg-orange-500 rounded-sm"></div>
            <span className="truncate">Low (2)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 lg:w-3 lg:h-3 bg-yellow-500 rounded-sm"></div>
            <span className="truncate">Okay (3)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-500 rounded-sm"></div>
            <span className="truncate">Good (4-5)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodChart;
