import React, { useState, useEffect } from 'react';

const MoodTracker = () => {
  const [currentMood, setCurrentMood] = useState(3);
  const [moodNote, setMoodNote] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewPeriod, setViewPeriod] = useState('week'); // 'week' or 'month'

  // Mood options with emojis and descriptions
  const moodOptions = [
    { value: 1, emoji: '😰', label: 'Very Low', color: '#ef4444' },
    { value: 2, emoji: '😟', label: 'Low', color: '#f97316' },
    { value: 3, emoji: '😐', label: 'Okay', color: '#eab308' },
    { value: 4, emoji: '😊', label: 'Good', color: '#22c55e' },
    { value: 5, emoji: '😁', label: 'Great', color: '#10b981' }
  ];

  // Load mood history from localStorage on component mount
  useEffect(() => {
    try {
      const savedMoods = localStorage.getItem('moodHistory');
      if (savedMoods) {
        const parsedMoods = JSON.parse(savedMoods);
        // Validate the data structure
        if (Array.isArray(parsedMoods)) {
          setMoodHistory(parsedMoods);
        } else {
          console.warn('Invalid mood history data in localStorage, clearing...');
          localStorage.removeItem('moodHistory');
        }
      }
    } catch (error) {
      console.error('Failed to load mood history from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('moodHistory');
    }
  }, []);

  // Save mood history to localStorage whenever it changes
  useEffect(() => {
    if (moodHistory.length > 0) {
      try {
        localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
      } catch (error) {
        console.error('Failed to save mood history to localStorage:', error);
        // If localStorage is full, try to clean up old entries
        if (error.name === 'QuotaExceededError') {
          const cleanedHistory = moodHistory.slice(-30); // Keep only last 30 entries
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

  const handleSubmitMood = () => {
    setIsSubmitting(true);
    
    const newMoodEntry = {
      id: Date.now(),
      mood: currentMood,
      note: moodNote.trim(),
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      timestamp: Date.now()
    };

    // Check if there's already an entry for today
    const today = new Date().toISOString().split('T')[0];
    const existingTodayIndex = moodHistory.findIndex(entry => entry.date === today);

    let updatedHistory;
    if (existingTodayIndex !== -1) {
      // Update today's entry
      updatedHistory = [...moodHistory];
      updatedHistory[existingTodayIndex] = newMoodEntry;
    } else {
      // Add new entry and keep only last 90 days for better analysis
      updatedHistory = [newMoodEntry, ...moodHistory].slice(0, 90);
    }

    setMoodHistory(updatedHistory);
    setMoodNote('');
    
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  const getMoodOption = (value) => moodOptions.find(option => option.value === value);

  const getDateRange = (period) => {
    const now = new Date();
    const endDate = new Date(now);
    const startDate = new Date(now);
    
    if (period === 'week') {
      startDate.setDate(now.getDate() - 6); // Last 7 days
    } else {
      startDate.setDate(now.getDate() - 29); // Last 30 days
    }
    
    return { startDate, endDate };
  };

  const getFilteredMoodData = (period) => {
    const { startDate } = getDateRange(period);
    return moodHistory.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate;
    }).reverse(); // Oldest first for chart display
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
    
    if (weekData.length < 2) return { trend: 'insufficient', insights: [] };
    
    // Calculate trend
    const recentMoods = weekData.slice(-7);
    const olderMoods = weekData.slice(-14, -7);
    
    const recentAvg = recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length;
    const olderAvg = olderMoods.length > 0 
      ? olderMoods.reduce((sum, entry) => sum + entry.mood, 0) / olderMoods.length 
      : recentAvg;
    
    let trend = 'stable';
    if (recentAvg > olderAvg + 0.3) trend = 'improving';
    else if (recentAvg < olderAvg - 0.3) trend = 'declining';
    
    // Generate insights
    const insights = [];
    const monthAvg = monthData.length > 0 
      ? monthData.reduce((sum, entry) => sum + entry.mood, 0) / monthData.length 
      : 0;
    
    if (monthAvg >= 4) {
      insights.push("You've been feeling consistently positive! 🌟");
    } else if (monthAvg <= 2) {
      insights.push("You've been going through a tough time. Consider reaching out for support. 💙");
    }
    
    // Pattern detection
    const weeklyPattern = getWeeklyPattern();
    if (weeklyPattern.bestDay && weeklyPattern.worstDay) {
      insights.push(`You tend to feel best on ${weeklyPattern.bestDay}s and lowest on ${weeklyPattern.worstDay}s.`);
    }
    
    // Streak detection
    const currentStreak = getCurrentStreak();
    if (currentStreak.type === 'positive' && currentStreak.days >= 3) {
      insights.push(`Great job! You've had ${currentStreak.days} consecutive days above average. 🎉`);
    }
    
    return { trend, insights, monthAvg: monthAvg.toFixed(1) };
  };

  const getWeeklyPattern = () => {
    const dayMoods = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }; // Sun-Sat
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    moodHistory.forEach(entry => {
      const dayOfWeek = new Date(entry.date).getDay();
      dayMoods[dayOfWeek].push(entry.mood);
    });
    
    const dayAverages = {};
    Object.keys(dayMoods).forEach(day => {
      if (dayMoods[day].length > 0) {
        dayAverages[day] = dayMoods[day].reduce((sum, mood) => sum + mood, 0) / dayMoods[day].length;
      }
    });
    
    if (Object.keys(dayAverages).length < 2) return { bestDay: null, worstDay: null };
    
    const bestDay = Object.keys(dayAverages).reduce((a, b) => dayAverages[a] > dayAverages[b] ? a : b);
    const worstDay = Object.keys(dayAverages).reduce((a, b) => dayAverages[a] < dayAverages[b] ? a : b);
    
    return {
      bestDay: dayNames[bestDay],
      worstDay: dayNames[worstDay]
    };
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

  const addSampleData = () => {
    const today = new Date();
    const sampleMoods = [];
    
    // Add sample data for the last 8 days
    for (let i = 0; i < 8; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const moods = [4, 2, 5, 3, 4, 1, 5, 3]; // Predefined mood pattern
      const notes = [
        "Good day at work", 
        "Feeling stressed", 
        "Amazing weekend!", 
        "", 
        "Productive day", 
        "Rough day", 
        "Celebrated with friends!", 
        "Normal day"
      ];
      
      sampleMoods.push({
        id: Date.now() + i,
        mood: moods[i],
        note: notes[i],
        date: date.toISOString().split('T')[0],
        timestamp: date.getTime()
      });
    }
    
    // Sort by date (oldest first)
    sampleMoods.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setMoodHistory(sampleMoods);
    localStorage.setItem('moodHistory', JSON.stringify(sampleMoods));
    console.log('Sample moods added:', sampleMoods);
    alert('Sample data added! You should now see colored bars and insights.');
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all mood data?')) {
      setMoodHistory([]);
      localStorage.removeItem('moodHistory');
      alert('All mood data cleared!');
    }
  };

  const getTodaysMood = () => {
    const today = new Date().toISOString().split('T')[0];
    return moodHistory.find(entry => entry.date === today);
  };

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

  const todaysMood = getTodaysMood();
  const chartData = getChartData(viewPeriod);
  const trends = getMoodTrends();

  return (
    <div className="mood-tracker">
      <div className="mood-tracker-header">
        <h2>Daily Mood Check-in</h2>
        <p>How are you feeling today?</p>
      </div>

      {/* Mood Selection */}
      <div className="mood-selection">
        <div className="mood-options">
          {moodOptions.map((option) => (
            <button
              key={option.value}
              className={`mood-option ${currentMood === option.value ? 'selected' : ''}`}
              onClick={() => setCurrentMood(option.value)}
              style={{
                borderColor: currentMood === option.value ? option.color : '#e5e7eb'
              }}
            >
              <div className="mood-emoji">{option.emoji}</div>
              <div className="mood-label">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Mood Note */}
      <div className="mood-note-section">
        <textarea
          className="mood-note-input"
          placeholder="What's contributing to your mood today? (optional)"
          value={moodNote}
          onChange={(e) => setMoodNote(e.target.value)}
          maxLength={200}
        />
        <div className="character-count">{moodNote.length}/200</div>
      </div>

      {/* Submit Button */}
      <button
        className="submit-mood-button"
        onClick={handleSubmitMood}
        disabled={isSubmitting}
        style={{
          backgroundColor: getMoodOption(currentMood).color
        }}
      >
        {isSubmitting ? (
          <span>Saving... ✨</span>
        ) : todaysMood ? (
          <span>Update Today's Mood</span>
        ) : (
          <span>Save Today's Mood</span>
        )}
      </button>

      {/* Today's Status */}
      {todaysMood && (
        <div className="todays-mood-status">
          <div className="status-header">Today's Mood</div>
          <div className="status-content">
            <span className="status-emoji">{getMoodOption(todaysMood.mood).emoji}</span>
            <span className="status-text">{getMoodOption(todaysMood.mood).label}</span>
            {todaysMood.note && <div className="status-note">"{todaysMood.note}"</div>}
          </div>
        </div>
      )}

      {/* Mood History & Trends */}
      {moodHistory.length > 0 && (
        <>
          {/* View Period Toggle */}
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewPeriod === 'week' ? 'active' : ''}`}
              onClick={() => setViewPeriod('week')}
            >
              7 Days
            </button>
            <button
              className={`toggle-btn ${viewPeriod === 'month' ? 'active' : ''}`}
              onClick={() => setViewPeriod('month')}
            >
              30 Days
            </button>
          </div>

          {/* Enhanced Mood Chart */}
          <div className="mood-history">
            <div className="history-header">
              <h3>Your Mood Journey</h3>
              <div className="mood-stats">
                <span>Trend: {trends.trend === 'improving' ? '📈' : trends.trend === 'declining' ? '📉' : '➡️'}</span>
                <span>•</span>
                <span>Avg: {trends.monthAvg}/5</span>
              </div>
            </div>
            
            <div className="enhanced-mood-chart">
              {chartData.map((dataPoint, index) => {
                const hasData = dataPoint.hasEntry && dataPoint.mood;
                const moodValue = dataPoint.mood || 0;
                const moodOption = hasData ? getMoodOption(moodValue) : null;
                
                return (
                  <div key={`${dataPoint.date}-${index}`} className="chart-item">
                    <div className="chart-bar-container">
                      {hasData ? (
                        <div 
                          className="chart-bar filled"
                          style={{
                            height: `${(moodValue / 5) * 100}%`,
                            backgroundColor: moodOption.color
                          }}
                          title={`${formatChartDate(dataPoint.date, viewPeriod)}: ${moodOption.label}${dataPoint.note ? ` - "${dataPoint.note}"` : ''}`}
                        ></div>
                      ) : (
                        <div 
                          className="chart-bar empty"
                          title={`${formatChartDate(dataPoint.date, viewPeriod)}: No entry`}
                        ></div>
                      )}
                    </div>
                    <div className="chart-emoji">
                      {hasData ? moodOption.emoji : '⭕'}
                    </div>
                    <div className="chart-date">
                      {formatChartDate(dataPoint.date, viewPeriod)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Insights Section */}
          {trends.insights.length > 0 && (
            <div className="insights-section">
              <h3>Your Patterns & Insights</h3>
              <div className="insights-list">
                {trends.insights.map((insight, index) => (
                  <div key={index} className="insight-item">
                    <span className="insight-icon">💡</span>
                    <span className="insight-text">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mood Legend */}
          <div className="mood-legend">
            <div className="legend-header">Mood Scale</div>
            <div className="legend-items">
              {moodOptions.map((option) => (
                <div key={option.value} className="legend-item">
                  <div 
                    className="legend-color" 
                    style={{ backgroundColor: option.color }}
                  ></div>
                  <span className="legend-emoji">{option.emoji}</span>
                  <span className="legend-label">{option.label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Encouragement Message */}
      <div className="encouragement-message">
        <p>
          {moodHistory.length === 0 
            ? "Starting your mood tracking journey! 🌟" 
            : `You've been tracking for ${moodHistory.length} ${moodHistory.length === 1 ? 'day' : 'days'}. Reflecting on your patterns helps build emotional awareness! 💪`
          }
        </p>
      </div>

      {/* Debug Buttons - Remove these in production */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginTop: '20px',
          justifyContent: 'center'
        }}>
          <button
            onClick={addSampleData}
            style={{
              padding: '8px 16px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Add Sample Data
          </button>
          <button
            onClick={clearAllData}
            style={{
              padding: '8px 16px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Clear All Data
          </button>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;