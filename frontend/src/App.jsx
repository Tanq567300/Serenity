import React, { useState } from 'react';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import DashboardHome from './components/dashboard/DashboardHome';
import ChatInterface from './components/chat/ChatInterface';
import MoodTracker from './components/mood/MoodTracker';
import useChat from './hooks/useChat';
import useMood from './hooks/useMood';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <Header 
          activeTab={activeTab}
          isModelReady={isModelReady}
          modelError={modelError}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
}

export default App;