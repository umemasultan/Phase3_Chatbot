import { useState } from 'react';
import { chatApi } from '../services/chatApi';

export const useChat = (userId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string, conversationId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatApi.sendMessage(userId, message, conversationId);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
    error
  };
};