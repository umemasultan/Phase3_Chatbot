'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Task } from '@/types/task';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { taskApi } from '@/lib/api';
import TaskCard from '@/components/TaskCard';
import FilterBar from '@/components/FilterBar';
import Button from '@/components/Button';
import { getCurrentUserIdFromToken } from '@/lib/auth';
import { ChatPanel } from '@/components/chatbot/ChatPanel';

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'status'>('date');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // Redirect to login if no token
          router.push('/auth/login');
          return;
        }

        // Get current user ID from token
        const userId = getCurrentUserIdFromToken();
        if (!userId) {
          // If we can't get user ID from token, fetch it from the API
          // For now, we'll use the existing endpoint but in a real implementation
          // we would call an endpoint to get the current user's information
          const statusFilter = filter !== 'all' ? filter : undefined;
          const data = await taskApi.getAll(statusFilter);
          setTasks(data);
        } else {
          // Use the new spec-compliant API endpoint
          const statusFilter = filter !== 'all' ? filter : undefined;
          const data = await taskApi.getAllForUser(userId, statusFilter);
          setTasks(data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filter]);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Search filter
    if (searchQuery) {
      result = result.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.updatedAt || b.createdAt || '').getTime() -
                 new Date(a.updatedAt || a.createdAt || '').getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'status':
          const statusOrder = { 'pending': 0, 'in-progress': 1, 'completed': 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });

    return result;
  }, [tasks, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-[#020817] dark:via-[#050E3C] dark:to-[#0A1854]">
      <Navbar />
      <div className="flex pt-20">
        <Sidebar />
        <main className="flex-1 px-6 py-8 sm:px-8 lg:px-12 w-full max-w-[1600px] mx-auto">
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-8">
              <div>
                <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-3">
                  Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg font-medium">Manage and track your tasks efficiently</p>
              </div>
              <Button href="/tasks/new" variant="primary" size="md">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-semibold">New Task</span>
                </span>
              </Button>
            </div>

            {/* Search and Sort Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3 pl-12 bg-white/50 dark:bg-[#0A1854]/50 border border-gray-200/50 dark:border-[#0A1854] rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none px-5 py-3 pr-10 bg-white/50 dark:bg-[#0A1854]/50 border border-gray-200/50 dark:border-[#0A1854] rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 cursor-pointer font-semibold"
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                  <option value="status">Sort by Status</option>
                </select>
                <svg className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="mt-8">
              <FilterBar currentFilter={filter} onFilterChange={setFilter} />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-24">
              <div className="inline-block relative">
                <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-900/30 rounded-full"></div>
                <div className="w-20 h-20 border-4 border-transparent border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-8 text-lg font-semibold">Loading your tasks...</p>
            </div>
          ) : (
            <>
              {/* Results count */}
              {(searchQuery || sortBy !== 'date') && (
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Found <span className="font-bold text-gray-900 dark:text-white">{filteredTasks.length}</span> task{filteredTasks.length !== 1 ? 's' : ''}
                    {searchQuery && <span> matching "<span className="font-semibold">{searchQuery}</span>"</span>}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </>
          )}

          {filteredTasks.length === 0 && !loading && (
            <div className="text-center py-24">
              {searchQuery ? (
                <>
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 via-gray-100 to-gray-200 dark:from-gray-800/20 dark:via-gray-800/20 dark:to-gray-700/20 rounded-3xl mb-8 shadow-2xl backdrop-blur-sm border border-gray-200/50 dark:border-[#0A1854]">
                    <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-3">No tasks found</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
                    No tasks match "<span className="font-semibold">{searchQuery}</span>"
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-[#0A1854] text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-3xl mb-8 shadow-2xl backdrop-blur-sm border border-gray-200/50 dark:border-[#0A1854]">
                    <svg className="w-12 h-12 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-3">No tasks yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">Start organizing your work by creating your first task</p>
                  <Link href="/tasks/new" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Your First Task
                  </Link>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Chatbot Floating Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 p-5 rounded-2xl text-white overflow-hidden group shadow-2xl z-[9999] transform hover:scale-110 transition-all duration-300"
          aria-label="Open chat"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        </button>
      )}

      {isChatOpen && (
        <div className="fixed bottom-8 right-8 z-[9999]">
          <div className="relative">
            <ChatPanel
              userId={getCurrentUserIdFromToken()?.toString() || '0'}
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}