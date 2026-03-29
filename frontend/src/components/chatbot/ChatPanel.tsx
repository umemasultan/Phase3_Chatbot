'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { useChat } from '../../hooks/useChat';
import { Message } from '../../types/chat';

type ChatPanelProps = {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
};

export const ChatPanel: React.FC<ChatPanelProps> = ({ userId, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { sendMessage, isLoading, error } = useChat(userId);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Add initial greeting message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'greeting',
          role: 'assistant',
          content: "Hi 👋 I can manage your tasks. Tell me what to do.",
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await sendMessage(content);

      // Add assistant response
      const assistantMessage: Message = {
        id: `resp-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="w-[420px] h-[650px] bg-white/95 dark:bg-[#0A1854]/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-[#0A1854] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-5 rounded-t-3xl flex justify-between items-center shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 rounded-2xl blur-md"></div>
            <div className="relative w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">🤖</span>
            </div>
          </div>
          <div>
            <h3 className="font-black text-xl tracking-tight">AI Assistant</h3>
            <p className="text-xs text-white/90 font-medium mt-0.5">Always here to help</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2.5 hover:bg-white/20 rounded-xl transition-all duration-200 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-gray-50/50 to-white dark:from-[#020817]/50 dark:to-[#0A1854] space-y-4">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            role={message.role}
            content={message.content}
            timestamp={message.timestamp}
          />
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl px-5 py-4 backdrop-blur-sm shadow-md">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200/50 dark:border-[#0A1854] p-5 bg-white/90 dark:bg-[#0A1854]/90 backdrop-blur-sm">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
        />
        {error && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};