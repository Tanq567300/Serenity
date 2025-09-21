import React, { useState } from 'react';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import BottomNavigation from './components/common/BottomNavigation';
import DashboardHome from './components/dashboard/DashboardHome';
import ChatInterface from './components/chat/ChatInterface';
import MoodTracker from './components/mood/MoodTracker';
import useChat from './hooks/useChat';
import useMood from './hooks/useMood';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Chat functionality
  const {
    messages,
    isLoading: chatLoading,
    isModelLoading,
    modelError,
    isModelReady,
    sendMessage
  } = useChat();

  // Mood functionality
  const { getMoodStats } = useMood();

  const handleNavigate = (tab) => {
    setActiveTab(tab);
  };

  const renderActiveTab = () => {
    switch(activeTab) {
      case 'dashboard':
        const moodData = getMoodStats();
        const chatStats = {
          sessions: Math.floor(messages.length / 4),
          lastSession: messages.length > 2 ? 'Today' : null
        };
        
        return (
          <DashboardHome 
            moodData={moodData} 
            chatStats={chatStats} 
            onNavigate={handleNavigate}
          />
        );
      
      case 'chat':
        return (
          <ChatInterface 
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={chatLoading}
            isModelReady={isModelReady}
            modelError={modelError}
          />
        );
      
      case 'mood':
        return <MoodTracker />;
      
      default:
        return (
          <DashboardHome 
            moodData={getMoodStats()} 
            chatStats={{ sessions: 0, lastSession: null }} 
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Sidebar */} 
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Content Area */}
        <main 
          className="flex-1 overflow-y-auto pb-24 lg:pb-8" 
          style={{ 
            paddingTop: '30px', 
            paddingLeft: '30px', 
            paddingRight: '30px', 
            paddingBottom: '30px',
            backgroundColor: '#F8F9FA'
          }}
        >
          {renderActiveTab()}
        </main>
              </div>
              
              {/* Bottom Navigation - Mobile Only */}
      <BottomNavigation 
        activeSection={activeTab}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default App;