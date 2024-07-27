import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { generateStudyPlan } from '../services/studyPlanService';
import { ChatMessage, StudyPlanRequest } from '../types/chatTypes';

const StudyGuideChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const studyPlanRequest = parseStudyPlanRequest(inputMessage);
      const studyPlan = await generateStudyPlan(studyPlanRequest.topic, studyPlanRequest.duration);

      const botMessage: ChatMessage = {
        id: uuidv4(),
        content: studyPlan,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error generating study plan:', error);
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: 'Sorry, I encountered an error while generating the study plan. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const parseStudyPlanRequest = (message: string): StudyPlanRequest => {
    const parts = message.split(',');
    if (parts.length !== 2) {
      throw new Error('Invalid input format. Please use: topic, duration');
    }
    const topic = parts[0].trim();
    const duration = parseInt(parts[1].trim(), 10);
    if (isNaN(duration)) {
      throw new Error('Invalid duration. Please provide a number.');
    }
    return { topic, duration };
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg max-w-lg w-full mx-auto">
        <div className="p-4 h-80 overflow-y-auto">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`mb-4 ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div 
                className={`inline-block p-2 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Enter topic, duration (e.g., 'JavaScript, 7')"
            className="flex-grow py-2 px-4 mr-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white py-2 px-4 rounded-full font-semibold focus:outline-none hover:bg-blue-600 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudyGuideChatbot;