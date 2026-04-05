'use client';

import { useTheme } from './ThemeProvider';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  let theme: 'light' | 'dark' = 'light';
  let toggleTheme: (() => void) | undefined;

  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    toggleTheme = themeContext.toggleTheme;
  } catch {
    // ThemeProvider not available, use fallback
    toggleTheme = undefined;
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !toggleTheme) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg group overflow-hidden"
      aria-label="Toggle theme"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity"></span>
      {theme === 'light' ? (
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300 relative z-10 transform group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-yellow-400 relative z-10 transform group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  );
}
