import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const MoodCalendar = ({ moodData = {} }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState(null);
  
  // Mood color mapping based on mood level (1-5 scale)
  const getMoodColor = (moodLevel) => {
    const moodColors = {
      1: '#FF6B6B', // Very Low - Red
      2: '#FFB347', // Low - Orange  
      3: '#FAFDD6', // Neutral - Light Yellow
      4: '#91ADC8', // Good - Light Blue
      5: '#AED6CF'  // Excellent - Mint Green
    };
    return moodColors[moodLevel] || '#F3F4F6'; // Default gray for no data
  };

  // Get mood label from level
  const getMoodLabel = (moodLevel) => {
    const moodLabels = {
      1: 'Very Low',
      2: 'Low',
      3: 'Neutral',
      4: 'Good',
      5: 'Excellent'
    };
    return moodLabels[moodLevel] || 'No data';
  };

  // Get mood emoji from level
  const getMoodEmoji = (moodLevel) => {
    const moodEmojis = {
      1: '😢',
      2: '😔',
      3: '😐',
      4: '😊',
      5: '😄'
    };
    return moodEmojis[moodLevel] || '⚪';
  };

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    // First day of the week for the month (0 = Sunday)
    const startDate = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < startDate; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const moodEntry = moodData?.history?.find(entry => 
        entry.date === dateString || new Date(entry.date).toDateString() === new Date(year, month, day).toDateString()
      );
      
      days.push({
        day,
        date: new Date(year, month, day),
        dateString,
        mood: moodEntry?.mood || null,
        label: moodEntry?.label || null,
        isToday: new Date().toDateString() === new Date(year, month, day).toDateString()
      });
    }
    
    return days;
  };

  // Navigate months
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg border border-gray-100" 
      style={{ 
        paddingTop: '20px', 
        paddingLeft: '20px', 
        paddingRight: '20px', 
        paddingBottom: '20px' 
      }}
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={previousMonth}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((dayData, index) => {
          if (!dayData) {
            return <div key={index} className="h-12"></div>;
          }

          const { day, mood, label, isToday, dateString } = dayData;
          const backgroundColor = mood ? getMoodColor(mood) : '#F9FAFB';
          const textColor = mood && mood <= 2 ? 'white' : '#374151';
          const isHovered = hoveredDay === dateString;
          
          return (
            <div
              key={index}
              className={`
                relative h-12 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group
                ${isToday ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                ${isHovered ? 'scale-110 shadow-lg z-10' : 'hover:scale-105 hover:shadow-md'}
              `}
              style={{ 
                backgroundColor, 
                color: textColor 
              }}
              onMouseEnter={() => setHoveredDay(dateString)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <span className="relative z-10">{day}</span>
              
              {/* Mood emoji indicator */}
              {mood && (
                <div className="absolute top-1 right-1 text-xs opacity-70 group-hover:opacity-100 transition-opacity">
                  {getMoodEmoji(mood)}
                </div>
              )}

              {/* Hover tooltip */}
              {isHovered && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-20">
                  <div className="flex items-center space-x-2">
                    <span>{getMoodEmoji(mood)}</span>
                    <span>
                      {mood 
                        ? `${label || getMoodLabel(mood)} - ${new Date(dateString).toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}`
                        : `No mood logged - ${new Date(dateString).toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}`
                      }
                    </span>
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mood Legend */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-gray-700">Mood Scale</h4>
          <div className="text-xs text-gray-500">
            {moodData?.history?.length || 0} days tracked this month
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {[1, 2, 3, 4, 5].map(level => (
            <div key={level} className="flex items-center space-x-2 group cursor-pointer">
              <div
                className="w-4 h-4 rounded-full transition-transform group-hover:scale-110"
                style={{ backgroundColor: getMoodColor(level) }}
              ></div>
              <span className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors">
                {getMoodEmoji(level)} {getMoodLabel(level)}
              </span>
            </div>
          ))}
        </div>
        
        {/* Quick Stats */}
        {moodData?.history && moodData.history.length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl" style={{ paddingTop: '5px', paddingLeft: '5px', paddingRight: '5px', paddingBottom: '5px' }}>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {moodData.weeklyAvg || 'N/A'}
                </div>
                <div className="text-xs text-gray-600">Weekly Average</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {moodData.streak || 0}
                </div>
                <div className="text-xs text-gray-600">Day Streak</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {moodData.history.length}
                </div>
                <div className="text-xs text-gray-600">Total Logs</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodCalendar;