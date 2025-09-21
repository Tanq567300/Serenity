import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const MoodCalendar = ({ moodData = {} }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState(null);
  
  // Mood color mapping based on mood level (1-5 scale)
  const getMoodColor = (moodLevel) => {
    const moodColors = {
      1: '#B95E82', // Very Low - Deep Rose
      2: '#F39F9F', // Low - Coral Pink  
      3: '#FFC29B', // Neutral - Warm Orange
      4: '#FFECC0', // Good - Primary Cream
      5: '#FFECC0'  // Excellent - Primary Cream (lighter shade)
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
      className="bg-white rounded-lg shadow-sm border border-gray-200" 
      style={{ 
        paddingTop: '16px', 
        paddingLeft: '16px', 
        paddingRight: '16px', 
        paddingBottom: '16px' 
      }}
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">
          Your Mood Journey
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={previousMonth}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-24 text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <ChevronRightIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayData, index) => {
          if (!dayData) {
            return <div key={index} className="h-8"></div>;
          }

          const { day, mood, label, isToday, dateString } = dayData;
          const backgroundColor = mood ? getMoodColor(mood) : '#F9FAFB';
          const textColor = mood && mood <= 2 ? 'white' : '#374151';
          const isHovered = hoveredDay === dateString;
          
          return (
            <div
              key={index}
              className={`
                relative h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer group
                ${isToday ? 'ring-1 ring-offset-1 ring-blue-500' : ''}
                ${isHovered ? 'scale-105 shadow-md z-10' : 'hover:scale-102 hover:shadow-sm'}
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
                <div className="absolute top-0 right-0 text-xs opacity-60 group-hover:opacity-100 transition-opacity">
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
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div 
          className="flex items-center justify-between mb-3" 
          style={{ paddingTop: '5px' }}
        >
          <h4 className="text-xs font-semibold text-gray-700">Mood Scale</h4>
          <div className="text-xs text-gray-500">
            {moodData?.history?.length || 0} days tracked
          </div>
        </div>
        <div 
          className="flex flex-wrap items-center gap-2" 
          style={{ paddingTop: '5px', paddingBottom: '5px' }}
        >
          {[1, 2, 3, 4, 5].map(level => (
            <div key={level} className="flex items-center space-x-1 group cursor-pointer">
              <div
                className="w-3 h-3 rounded-full transition-transform group-hover:scale-105"
                style={{ backgroundColor: getMoodColor(level) }}
              ></div>
              <span className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors">
                {getMoodEmoji(level)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodCalendar;