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
    <aside className={`${isMobile ? 'fixed inset-y-0 left-0 z-50' : ''} bg-white shadow h-full ${isExpanded ? 'w-64' : 'w-20'} transition-all duration-300`}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? '«' : '»'}
          </button>
          {isMobile && (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700 md:hidden"
            >
              ✕
            </button>
          )}
        </div>

        {isExpanded && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>

            <div className="mb-8 flex-1">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
              <ul className="space-y-1">
                {filters.map((filter) => (
                  <li key={filter.value}>
                    <Link
                      href={`/?filter=${filter.value}`}
                      className={`block px-3 py-2 text-sm rounded-md ${
                        pathname.includes(filter.value) || (filter.value === 'all' && pathname === '/')
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {filter.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Statistics</h3>
              <ul className="space-y-2">
                {stats.map((stat) => (
                  <li key={stat.name} className="flex justify-between text-sm">
                    <span className="text-gray-600">{stat.name}</span>
                    <span className="font-medium">{stat.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}