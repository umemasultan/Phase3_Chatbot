'use client';

import { useState, useEffect } from 'react';
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

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [loading, setLoading] = useState(true);

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

  // Tasks are already filtered by the backend API
  const filteredTasks = tasks;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/50 to-purple-50/50 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30 pb-20">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full mt-16">
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-1.5">
                  All Tasks
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-semibold">Organize, prioritize, and accomplish your goals</p>
              </div>
              <Button href="/tasks/new" variant="primary" size="md">
                <span className="flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  New Task
                </span>
              </Button>
            </div>
            <div className="mt-8">
              <FilterBar currentFilter={filter} onFilterChange={setFilter} />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-32">
              <div className="inline-block relative">
                <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
                <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-8 text-xl font-bold">Loading your tasks...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}

          {filteredTasks.length === 0 && !loading && (
            <div className="text-center py-32">
              <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-3xl mb-8 shadow-2xl ring-8 ring-white/50 dark:ring-slate-800/50">
                <svg className="w-14 h-14 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-3xl font-black text-gray-800 dark:text-gray-200 mb-3">No tasks yet</h3>
              <p className="text-gray-600 dark:text-gray-400 text-xl mb-6 font-semibold">Start by creating your first task</p>
              <Link href="/tasks/new" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 ring-4 ring-blue-200/50 dark:ring-blue-900/50">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Create Task
              </Link>
            </div>
          )}
        </main>
      </div>

      {/* Footer with Author Credit */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-gray-200/30 dark:border-slate-700/30 py-4 z-40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            Crafted with <span className="text-red-500 animate-pulse">❤️</span> by{' '}
            <span className="font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Umema Sultan
            </span>
            {' '}© 2026
          </p>
        </div>
      </footer>
    </div>
  );
}