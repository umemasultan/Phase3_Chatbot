'use client';

import React from 'react';

type ChatBubbleProps = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export const ChatBubble: React.FC<ChatBubbleProps> = ({ role, content, timestamp }) => {
  const isUser = role === 'user';

  // Format time as HH:MM
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div
        className={`max-w-[85%] px-5 py-3.5 rounded-2xl shadow-lg ${
          isUser
            ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white rounded-br-sm'
            : 'bg-white dark:bg-[#0A1854] text-gray-800 dark:text-gray-200 rounded-bl-sm border border-gray-200/50 dark:border-[#0A1854]'
        }`}
      >
        <p className="text-sm leading-relaxed font-medium">{content}</p>
        <p
          className={`text-xs mt-2 font-medium ${
            isUser ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {formatTime(timestamp)}
        </p>
      </div>
    </div>
  );
};