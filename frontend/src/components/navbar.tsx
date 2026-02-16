'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@/types/task';
import Button from './Button';
import { removeToken } from '@/lib/auth';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  // Check for user in localStorage (mock auth)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, we'd decode the JWT to get user info
      setUser({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      });
    }
  }, []);

  const handleLogout = () => {
    removeToken();
    setUser(null);
  };

  const navLinks = [
    { name: 'Dashboard', href: '/' },
    { name: 'Tasks', href: '/tasks' },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                TaskManager
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`${
                    pathname === link.href
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center">
                <div className="mr-4 text-sm text-gray-700 hidden md:block">
                  Welcome, {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Logout
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