import React from 'react';
import MoodEntry from './mood/MoodEntry';
import MoodCalendar from './mood/MoodCalendar';
import Streak from './mood/Streak';
import useMood from '../hooks/useMood';

const MoodTracker = () => {
  const {
    isSubmitting,
    viewPeriod,
    setViewPeriod,
    submitMood,
    getTodaysMood,
    getChartData,
    getMoodTrends,
    getCurrentStreak
  } = useMood();

  const todaysMood = getTodaysMood();
  const chartData = getChartData(viewPeriod);
  const trends = getMoodTrends();
  const streakData = getCurrentStreak();

  const handleMoodSubmit = (mood, note) => {
    submitMood(mood, note);
  };

  return (
    <div className="space-y-6">
      {/* Mood Entry Section */}
      <MoodEntry 
        onSubmit={handleMoodSubmit}
        todaysMood={todaysMood}
        isSubmitting={isSubmitting}
      />

      {/* Chart and Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Calendar - Takes 1 column */}
        <div>
          <MoodCalendar 
            moodData={chartData}
          />
        </div>

        {/* Streak and Insights - Takes 1 column */}
        <div>
          <Streak 
            streakData={streakData}
            trends={trends}
          />
        </div>
      </div>

      {/* Encouragement Message */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Keep Growing Your Self-Awareness
          </h3>
          <p className="text-gray-600">
            Tracking your mood patterns helps you understand yourself better and build emotional resilience. 
            You're taking an important step towards better mental wellness.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;