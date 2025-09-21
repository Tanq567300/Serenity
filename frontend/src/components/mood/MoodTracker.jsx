import React, { useState } from 'react';
import MoodEntry from './MoodEntry';
import MoodChart from './MoodChart';
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
    <div className="space-y-6">
      {/* Mood Entry Section */}
      <MoodEntry
        onSubmit={submitMood}
        todaysMood={todaysMood}
        isSubmitting={isSubmitting}
      />

      {/* Chart Section */}
      <MoodChart
        chartData={chartData}
        viewPeriod={viewPeriod}
        onPeriodChange={setViewPeriod}
      />

      {/* Streak and Insights */}
      <Streak
        streakData={streakData}
        trends={trends}
      />
    </div>
  );
};

export default MoodTracker;