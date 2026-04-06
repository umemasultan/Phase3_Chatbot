'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@/types/task';
import Button from './Button';
import { removeToken } from '@/lib/auth';
import { authApi } from '@/lib/api';
import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  // Fetch user info from API when token exists
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Fetch actual user info from API
          const userData = await authApi.getCurrentUser();
          // Update name to "Umema Sultan" as requested
          setUser({
            ...userData,
            name: 'Umema Sultan'
          });
        } catch (error) {
          console.error('Error fetching user:', error);
          // Fallback to hardcoded user if API fails
          setUser({
            id: 1,
            name: 'Umema Sultan',
            email: 'umema@example.com'
          });
        }
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    removeToken();
    setUser(null);
  };

  const navLinks = [
    { name: 'Dashboard', href: '/' },
    { name: 'All Tasks', href: '/tasks' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border-b border-gray-200/30 dark:border-slate-700/30 shadow-lg">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl blur-md opacity-40 group-hover:opacity-80 transition-all duration-300"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all duration-300">
                    <span className="text-white font-black text-xl">T</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    TaskManager
                  </span>
                  <span className="text-[10px] text-gray-600 dark:text-gray-400 font-semibold tracking-wide uppercase -mt-0.5">By Umema Sultan</span>
                </div>
              </Link>
            </div>
            <div className="hidden sm:flex sm:space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    pathname === link.href
                      ? 'text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-slate-800/80 hover:shadow-md'
                  }`}
                >
                  {pathname === link.href && (
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg shadow-lg"></span>
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden md:flex items-center space-x-2.5 px-3 py-1.5 bg-gradient-to-r from-gray-100/90 to-gray-200/70 dark:from-slate-800/90 dark:to-slate-700/70 rounded-lg border border-gray-300/30 dark:border-slate-600/30 shadow-md backdrop-blur-xl">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-sm font-bold">{user.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-100">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">● Active</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="relative px-4 py-2 rounded-lg text-xs font-bold text-white overflow-hidden group shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-red-600 via-pink-600 to-red-700"></span>
                  <span className="relative z-10 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Button href="/auth/login" variant="outline" size="sm">
                  Log in
                </Button>
                <Button href="/auth/signup" variant="primary" size="sm">
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
