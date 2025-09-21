import React from 'react';
import StatsCard from './StatsCard';
import QuickActions from './QuickActions';
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
    <div className="space-y-4 lg:space-y-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Mood Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Mood Overview</h3>
            <button 
              onClick={() => onNavigate('mood')}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              View Details →
            </button>
          </div>
          
          {moodData?.history && moodData.history.length > 0 ? (
            <div className="space-y-4">
              {/* Mini mood chart */}
              <div className="flex items-end space-x-2 h-32 bg-gray-50 rounded-lg p-4">
                {moodData.history.slice(-7).map((entry, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-indigo-500 rounded-t-sm"
                      style={{ height: `${(entry.mood / 5) * 100}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(entry.date).toLocaleDateString('en', { weekday: 'short' })}
                    </div>
                  </div>
                ))}
              </div>
              
              {moodData.insights && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Latest Insight</h4>
                  <p className="text-blue-800 text-sm">{moodData.insights[0]}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <SimpleIcons.Smile className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Start tracking your mood to see insights here</p>
              <button 
                onClick={() => onNavigate('mood')}
                className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Log First Mood
              </button>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions onNavigate={onNavigate} />
          
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            
            {recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map(activity => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">No recent activity</p>
                <p className="text-gray-400 text-xs mt-1">Start using the app to see your activity here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
