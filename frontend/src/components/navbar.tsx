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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-[#050E3C]/90 backdrop-blur-2xl border-b border-gray-200/50 dark:border-[#0A1854]/50 shadow-lg">
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between h-20">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-white font-black text-2xl">T</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    TaskManager
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium -mt-1">Organize & Achieve</span>
                </div>
              </Link>
            </div>
            <div className="hidden sm:flex sm:space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    pathname === link.href
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-[#0A1854]/50'
                  }`}
                >
                  {pathname === link.href && (
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-xl"></span>
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden md:flex items-center space-x-3 px-5 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#0A1854] dark:to-[#050E3C] rounded-xl border border-gray-200/50 dark:border-[#0A1854] shadow-md backdrop-blur-sm">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-75"></div>
                    <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-[#050E3C]">
                      <span className="text-white text-sm font-bold">{user.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Active now</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="relative px-5 py-2.5 rounded-xl text-sm font-semibold text-white overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 transition-transform duration-300 group-hover:scale-105"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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