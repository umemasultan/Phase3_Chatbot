import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { handleUnauthorized } from '@/lib/auth';

interface ApiConfig {
  requiresAuth?: boolean;
}

export const useApi = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle API call with error handling
  const callApi = async <T,>(
    apiFunction: () => Promise<T>,
    config: ApiConfig = {}
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      // Check authentication if required
      if (config.requiresAuth) {
        // This will be handled by the API client itself
      }

      const result = await apiFunction();
      return result;
    } catch (err: any) {
      console.error('API call error:', err);

      if (err.message === 'Unauthorized') {
        handleUnauthorized();
        return null;
      }

      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { callApi, loading, error };
};