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
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Your Mood Journey</h3>
        
        {/* View Period Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
          <button
            className={`flex-1 sm:flex-none px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewPeriod === 'week'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => onPeriodChange('week')}
          >
            7 Days
          </button>
          <button
            className={`flex-1 sm:flex-none px-3 py-1 rounded-md text-sm font-medium transition-colors ${
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
      <div className="space-y-4">
        <div className="flex items-end justify-between h-32 sm:h-40 bg-gray-50 rounded-lg p-3 sm:p-4 overflow-x-auto">
          {chartData.map((dataPoint, index) => {
            const hasData = dataPoint.hasEntry && dataPoint.mood;
            const moodValue = dataPoint.mood || 0;
            
            return (
              <div key={`${dataPoint.date}-${index}`} className="flex flex-col items-center flex-1 min-w-0">
                <div className="flex flex-col items-center justify-end h-full mb-2">
                  {hasData ? (
                    <div 
                      className={`w-4 sm:w-6 rounded-t-sm ${getMoodColor(moodValue)} transition-all duration-300 hover:opacity-80`}
                      style={{
                        height: `${(moodValue / 5) * 100}%`,
                        minHeight: '8px'
                      }}
                      title={`${formatChartDate(dataPoint.date, viewPeriod)}: ${getMoodEmoji(moodValue)} (${moodValue}/5)${dataPoint.note ? ` - "${dataPoint.note}"` : ''}`}
                    ></div>
                  ) : (
                    <div 
                      className="w-4 sm:w-6 h-2 bg-gray-200 rounded-sm"
                      title={`${formatChartDate(dataPoint.date, viewPeriod)}: No entry`}
                    ></div>
                  )}
                </div>
                
                <div className="text-center">
                  <div className="text-sm sm:text-lg mb-1">
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
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-gray-600 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
            <span>Very Low (1)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
            <span>Low (2)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
            <span>Okay (3)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <span>Good (4-5)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodChart;
