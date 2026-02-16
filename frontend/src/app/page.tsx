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

export default function Dashboard() {
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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-0">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <Button href="/tasks/new" variant="primary" size="md">
                New Task
              </Button>
            </div>
            <div className="mt-4">
              <FilterBar currentFilter={filter} onFilterChange={setFilter} />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <p>Loading tasks...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}

          {filteredTasks.length === 0 && !loading && (
            <div className="text-center py-10">
              <p className="text-gray-500">No tasks found. <Link href="/tasks/new" className="text-blue-600 hover:underline">Create one?</Link></p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}