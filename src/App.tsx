import React from 'react';
import StudyGuideChatbot from './components/StudyGuideChatbot';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Study Guide Chatbot</h1>
        <StudyGuideChatbot />
      </div>
    </div>
  );
};

export default App;