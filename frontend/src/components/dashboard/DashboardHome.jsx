import React from 'react';
import StatsCard from './StatsCard';
import QuickActions from './QuickActions';
import MoodCalendar from '../mood/MoodCalendar';
import { SimpleIcons } from '../common/SimpleIcons';

const DashboardHome = ({ moodData, chatStats, onNavigate }) => {
  // Calculate trend based on mood data
  const getMoodTrend = () => {
    if (!moodData?.history || moodData.history.length < 2) return null;
    const recent = moodData.history.slice(-3);
    const older = moodData.history.slice(-6, -3);
    
    if (recent.length === 0 || older.length === 0) return null;
    
    const recentAvg = recent.reduce((sum, entry) => sum + entry.mood, 0) / recent.length;
    const olderAvg = older.reduce((sum, entry) => sum + entry.mood, 0) / older.length;
    
    if (recentAvg > olderAvg + 0.3) return 'up';
    if (recentAvg < olderAvg - 0.3) return 'down';
    return 'stable';
  };

  // Get recent activity
  const getRecentActivity = () => {
    const activities = [];
    
    // Add mood activity
    if (moodData?.today) {
      activities.push({
        id: 1,
        type: 'mood',
        message: `Logged mood: ${moodData.today.label}`,
        time: 'Today',
        icon: SimpleIcons.Smile
      });
    }
    
    // Add chat activity
    if (chatStats?.lastSession) {
      activities.push({
        id: 2,
        type: 'chat',
        message: 'Completed AI chat session',
        time: chatStats.lastSession,
        icon: SimpleIcons.Chat
      });
    }
    
    return activities.slice(0, 3); // Limit to 3 recent activities
  };

  const recentActivities = getRecentActivity();

  return (
    <div className="space-y-10 lg:space-y-12 h-full flex flex-col p-8 lg:p-12">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        <StatsCard
          title="Today's Mood"
          value={moodData?.today?.label || 'Not set'}
          subtitle="Rate your current mood"
          icon={SimpleIcons.Smile}
          color="blue"
        />
        
        <StatsCard
          title="Weekly Average"
          value={moodData?.weeklyAvg || '0'}
          subtitle="This week's mood average"
          icon={SimpleIcons.Chart}
          color="green"
          trend={getMoodTrend()}
        />
        
        <StatsCard
          title="Chat Sessions"
          value={chatStats?.sessions || '0'}
          subtitle="Conversations this week"
          icon={SimpleIcons.Chat}
          color="purple"
        />
        
        <StatsCard
          title="Current Streak"
          value={`${moodData?.streak || 0} days`}
          subtitle="Daily check-in streak"
          icon={SimpleIcons.Fire}
          color="orange"
        />
      </div>

      {/* Main Content Grid - Takes remaining space */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 flex-1 min-h-0">
        {/* Mood Calendar */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">Mood Overview</h3>
            <button 
              onClick={() => onNavigate('mood')}
              className="text-blue-600 hover:text-blue-800 text-base font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <span>Track Mood</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1">
            <MoodCalendar moodData={moodData} />
          </div>

          {/* Mood Insights */}
          {moodData?.insights && moodData.insights.length > 0 && (
            <div className="mt-8 rounded-2xl p-8 border border-green-100" style={{ background: 'linear-gradient(to right, rgba(174, 214, 207, 0.1), rgba(250, 253, 214, 0.2))' }}>
              <h4 className="font-semibold text-green-900 mb-4 text-lg flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Latest Insight
              </h4>
              <p className="text-green-800 text-base leading-relaxed">{moodData.insights[0]}</p>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-10 flex flex-col h-full">
          {/* Quick Actions */}
          <QuickActions onNavigate={onNavigate} />
          
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 lg:p-12 flex-1 flex flex-col">
            <h3 className="text-xl font-semibold text-gray-900 mb-10">Recent Activity</h3>
            
            {recentActivities.length > 0 ? (
              <div className="space-y-8 flex-1">
                {recentActivities.map(activity => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-center space-x-8 p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-200">
                      <div className="flex-shrink-0 p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, #91ADC8 0%, #AED6CF 100%)' }}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-base text-gray-900 font-medium mb-2">{activity.message}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 flex-1 flex flex-col justify-center">
                <p className="text-gray-500 text-xl mb-4">No recent activity</p>
                <p className="text-gray-400 text-lg">Start using the app to see your activity here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
