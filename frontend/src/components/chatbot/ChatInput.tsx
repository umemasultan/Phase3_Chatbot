'use client';

import React, { useState } from 'react';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  disabled: boolean;
};

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled}
        className="flex-1 border-2 border-gray-200 dark:border-[#0A1854] bg-white dark:bg-[#0A1854]/50 text-gray-900 dark:text-gray-100 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 font-medium shadow-sm"
      />
      <button
        type="submit"
        disabled={disabled || !inputValue.trim()}
        className="relative p-4 rounded-xl text-white overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed group transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600"></span>
        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </form>
  );
};