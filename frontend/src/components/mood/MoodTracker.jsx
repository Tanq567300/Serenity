import React, { useState } from 'react';
import MoodEntry from './MoodEntry';
import MoodCalendar from './MoodCalendar';
import Streak from './Streak';
import useMood from '../../hooks/useMood';

const MoodTracker = () => {
  const {
    viewPeriod,
    setViewPeriod,
    submitMood,
    getTodaysMood,
    getChartData,
    getMoodTrends,
    getCurrentStreak,
    isSubmitting
  } = useMood();

  const todaysMood = getTodaysMood();
  const chartData = getChartData(viewPeriod);
  const trends = getMoodTrends();
  const streakData = getCurrentStreak();

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Mood Entry Section */}
      <MoodEntry
        onSubmit={submitMood}
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
    </div>
  );
};

export default MoodTracker;