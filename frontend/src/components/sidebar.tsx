'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if screen is mobile on initial render and on resize
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const stats = [
    { name: 'Total Tasks', value: 12 },
    { name: 'Pending', value: 5 },
    { name: 'In Progress', value: 4 },
    { name: 'Completed', value: 3 },
  ];

  const filters = [
    { name: 'All Tasks', value: 'all' },
    { name: 'Pending', value: 'pending' },
    { name: 'In Progress', value: 'in-progress' },
    { name: 'Completed', value: 'completed' },
  ];

  return (
    <aside className={`${isMobile ? 'fixed inset-y-0 left-0 z-40 backdrop-blur-2xl bg-white/95 dark:bg-[#050E3C]/95 mt-16' : 'sticky top-16 bg-white/70 dark:bg-[#050E3C]/80 backdrop-blur-2xl'} border-r border-gray-200/50 dark:border-[#0A1854]/50 ${isMobile ? 'h-[calc(100vh-4rem)]' : 'h-[calc(100vh-4rem)]'} ${isExpanded ? 'w-80' : 'w-20'} transition-all duration-300 flex-shrink-0 shadow-2xl`}>
      <div className="p-6 h-full flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative p-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-xl transition-all duration-200 group overflow-hidden hover:shadow-lg"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity"></span>
            {isExpanded ? (
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
          {isMobile && isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#0A1854] rounded-lg md:hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {isExpanded && (
          <>
            <div className="mb-8">
              <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                <span className="w-10 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mr-2 rounded-full"></span>
                Filters
              </h2>
              <ul className="space-y-2">
                {filters.map((filter) => (
                  <li key={filter.value}>
                    <Link
                      href={`/?filter=${filter.value}`}
                      className={`relative flex items-center px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-300 overflow-hidden group ${
                        pathname.includes(filter.value) || (filter.value === 'all' && pathname === '/')
                          ? 'text-white shadow-xl'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#0A1854]/50'
                      }`}
                    >
                      {(pathname.includes(filter.value) || (filter.value === 'all' && pathname === '/')) && (
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient"></span>
                      )}
                      <span className="relative z-10 mr-3 text-xl">
                        {filter.value === 'all' && '📋'}
                        {filter.value === 'pending' && '⏳'}
                        {filter.value === 'in-progress' && '🔄'}
                        {filter.value === 'completed' && '✅'}
                      </span>
                      <span className="relative z-10">{filter.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-[#0A1854]">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                <span className="w-10 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mr-2 rounded-full"></span>
                Statistics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                  <div key={stat.name} className="relative group overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0A1854] dark:to-[#050E3C] p-4 rounded-xl border border-gray-200/50 dark:border-[#0A1854] hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">{stat.value}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 font-semibold">{stat.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}