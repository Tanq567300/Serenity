import { useState, useEffect } from 'react';

const useMood = () => {
  const [moodHistory, setMoodHistory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewPeriod, setViewPeriod] = useState('week');

  const moodOptions = [
    { value: 1, emoji: '😰', label: 'Very Low', color: '#ef4444' },
    { value: 2, emoji: '😟', label: 'Low', color: '#f97316' },
    { value: 3, emoji: '😐', label: 'Okay', color: '#eab308' },
    { value: 4, emoji: '😊', label: 'Good', color: '#22c55e' },
    { value: 5, emoji: '😁', label: 'Great', color: '#10b981' }
  ];

  // Load mood history from localStorage
  useEffect(() => {
    try {
      const savedMoods = localStorage.getItem('moodHistory');
      if (savedMoods) {
        const parsedMoods = JSON.parse(savedMoods);
        if (Array.isArray(parsedMoods)) {
          setMoodHistory(parsedMoods);
        } else {
          console.warn('Invalid mood history data in localStorage, clearing...');
          localStorage.removeItem('moodHistory');
        }
      }
    } catch (error) {
      console.error('Failed to load mood history from localStorage:', error);
      localStorage.removeItem('moodHistory');
    }
  }, []);

  // Save mood history to localStorage
  useEffect(() => {
    if (moodHistory.length > 0) {
      try {
        localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
      } catch (error) {
        console.error('Failed to save mood history to localStorage:', error);
        if (error.name === 'QuotaExceededError') {
          const cleanedHistory = moodHistory.slice(-30);
          try {
            localStorage.setItem('moodHistory', JSON.stringify(cleanedHistory));
            setMoodHistory(cleanedHistory);
          } catch (retryError) {
            console.error('Failed to save cleaned mood history:', retryError);
          }
        }
      }
    }
  }, [moodHistory]);

  const submitMood = async (mood, note) => {
    setIsSubmitting(true);
    
    const newMoodEntry = {
      id: Date.now(),
      mood,
      note: note.trim(),
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now()
    };

    const today = new Date().toISOString().split('T')[0];
    const existingTodayIndex = moodHistory.findIndex(entry => entry.date === today);

    let updatedHistory;
    if (existingTodayIndex !== -1) {
      updatedHistory = [...moodHistory];
      updatedHistory[existingTodayIndex] = newMoodEntry;
    } else {
      updatedHistory = [newMoodEntry, ...moodHistory].slice(0, 90);
    }

    setMoodHistory(updatedHistory);
    
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  const getTodaysMood = () => {
    const today = new Date().toISOString().split('T')[0];
    return moodHistory.find(entry => entry.date === today);
  };

  const getDateRange = (period) => {
    const now = new Date();
    const endDate = new Date(now);
    const startDate = new Date(now);
    
    if (period === 'week') {
      startDate.setDate(now.getDate() - 6);
    } else {
      startDate.setDate(now.getDate() - 29);
    }
    
    return { startDate, endDate };
  };

  const getFilteredMoodData = (period) => {
    const { startDate } = getDateRange(period);
    return moodHistory.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate;
    }).reverse();
  };

  const generateDateLabels = (period) => {
    const { startDate, endDate } = getDateRange(period);
    const labels = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      labels.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return labels;
  };

  const getChartData = (period) => {
    const dateLabels = generateDateLabels(period);
    const filteredData = getFilteredMoodData(period);
    
    return dateLabels.map(date => {
      const entry = filteredData.find(mood => mood.date === date);
      return {
        date,
        mood: entry ? entry.mood : null,
        note: entry ? entry.note : null,
        hasEntry: !!entry,
        id: entry ? entry.id : null
      };
    });
  };

  const getMoodTrends = () => {
    const weekData = getFilteredMoodData('week');
    const monthData = getFilteredMoodData('month');
    
    if (weekData.length < 2) return { trend: 'insufficient', insights: [], monthAvg: '0' };
    
    const recentMoods = weekData.slice(-7);
    const olderMoods = weekData.slice(-14, -7);
    
    const recentAvg = recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length;
    const olderAvg = olderMoods.length > 0 
      ? olderMoods.reduce((sum, entry) => sum + entry.mood, 0) / olderMoods.length 
      : recentAvg;
    
    let trend = 'stable';
    if (recentAvg > olderAvg + 0.3) trend = 'improving';
    else if (recentAvg < olderAvg - 0.3) trend = 'declining';
    
    const insights = [];
    const monthAvg = monthData.length > 0 
      ? monthData.reduce((sum, entry) => sum + entry.mood, 0) / monthData.length 
      : 0;
    
    if (monthAvg >= 4) {
      insights.push("You've been feeling consistently positive!");
    } else if (monthAvg <= 2) {
      insights.push("You've been going through a tough time. Consider reaching out for support.");
    }
    
    const currentStreak = getCurrentStreak();
    if (currentStreak.type === 'positive' && currentStreak.days >= 3) {
      insights.push(`Great job! You've had ${currentStreak.days} consecutive days above average.`);
    }
    
    return { trend, insights, monthAvg: monthAvg.toFixed(1) };
  };

  const getCurrentStreak = () => {
    if (moodHistory.length < 2) return { type: 'none', days: 0 };
    
    const sortedHistory = [...moodHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
    const avgMood = moodHistory.reduce((sum, entry) => sum + entry.mood, 0) / moodHistory.length;
    
    let streak = 0;
    let streakType = sortedHistory[0].mood >= avgMood ? 'positive' : 'negative';
    
    for (let entry of sortedHistory) {
      const isPositive = entry.mood >= avgMood;
      if ((streakType === 'positive' && isPositive) || (streakType === 'negative' && !isPositive)) {
        streak++;
      } else {
        break;
      }
    }
    
    return { type: streakType, days: streak };
  };

  const getMoodStats = () => {
    const today = getTodaysMood();
    const weekData = getFilteredMoodData('week');
    const weeklyAvg = weekData.length > 0 
      ? (weekData.reduce((sum, entry) => sum + entry.mood, 0) / weekData.length).toFixed(1)
      : '0';
    
    const streak = getCurrentStreak();
    const trends = getMoodTrends();
    
    return {
      today: today ? moodOptions.find(opt => opt.value === today.mood) : null,
      weeklyAvg,
      streak: streak.days,
      history: moodHistory,
      insights: trends.insights
    };
  };

  const clearAllData = () => {
    setMoodHistory([]);
    localStorage.removeItem('moodHistory');
  };

  return {
    moodHistory,
    isSubmitting,
    viewPeriod,
    setViewPeriod,
    submitMood,
    getTodaysMood,
    getChartData,
    getMoodTrends,
    getCurrentStreak,
    getMoodStats,
    clearAllData,
    moodOptions
  };
};

export default useMood;
