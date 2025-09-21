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
    <div className="space-y-6 lg:space-y-8 h-full flex flex-col">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 flex-1 min-h-0">
        {/* Mood Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Mood Overview</h3>
            <button 
              onClick={() => onNavigate('mood')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
            >
              View Details →
            </button>
          </div>
          
          {moodData?.history && moodData.history.length > 0 ? (
            <div className="space-y-6 flex-1 flex flex-col">
              {/* Mini mood chart */}
              <div className="flex items-end space-x-3 h-48 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 flex-1">
                {moodData.history.slice(-7).map((entry, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div 
                      className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
                      style={{ 
                        height: `${(entry.mood / 5) * 100}%`, 
                        background: `linear-gradient(to top, #647FBC, #91ADC8)`
                      }}
                    ></div>
                    <div className="text-sm text-gray-600 mt-3 font-medium">
                      {new Date(entry.date).toLocaleDateString('en', { weekday: 'short' })}
                    </div>
                  </div>
                ))}
              </div>
              
              {moodData.insights && (
                <div className="rounded-xl p-6 border border-green-100" style={{ background: 'linear-gradient(to right, rgba(174, 214, 207, 0.1), rgba(250, 253, 214, 0.2))' }}>
                  <h4 className="font-semibold text-green-900 mb-3 text-lg">Latest Insight</h4>
                  <p className="text-green-800 text-base leading-relaxed">{moodData.insights[0]}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 flex-1 flex flex-col justify-center">
              <SimpleIcons.Smile className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <p className="text-gray-500 text-lg mb-6">Start tracking your mood to see insights here</p>
              <button 
                onClick={() => onNavigate('mood')}
                className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl"
                style={{ background: 'linear-gradient(135deg, #647FBC 0%, #91ADC8 100%)' }}
              >
                Log First Mood
              </button>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6 flex flex-col h-full">
          {/* Quick Actions */}
          <QuickActions onNavigate={onNavigate} />
          
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex-1 flex flex-col">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
            
            {recentActivities.length > 0 ? (
              <div className="space-y-4 flex-1">
                {recentActivities.map(activity => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
                      <div className="flex-shrink-0 p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #91ADC8 0%, #AED6CF 100%)' }}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-base text-gray-900 font-medium">{activity.message}</p>
                        <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 flex-1 flex flex-col justify-center">
                <p className="text-gray-500 text-lg mb-2">No recent activity</p>
                <p className="text-gray-400 text-base">Start using the app to see your activity here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
