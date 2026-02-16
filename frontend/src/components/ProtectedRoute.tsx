'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true for protected routes, false for public routes that redirect if logged in
}

export default function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const checkAuth = () => {
      if (requireAuth) {
        // This route requires authentication
        if (!token) {
          // Redirect to login if not authenticated
          router.push('/auth/login');
        } else {
          setIsLoading(false);
        }
      } else {
        // This route should redirect if already logged in (like login/signup pages)
        if (token) {
          router.push('/');
        } else {
          setIsLoading(false);
        }
      }
    };

    checkAuth();
  }, [token, requireAuth, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If not loading and token status has been checked, render children
  return <>{children}</>;
}