'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { taskApi } from '@/lib/api';
import TaskForm from '@/components/TaskForm';
import Button from '@/components/Button';
import { getCurrentUserIdFromToken } from '@/lib/auth';

export default function CreateTaskPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      // Get current user ID and use the new API endpoint
      const userId = getCurrentUserIdFromToken();
      if (userId) {
        // Use the new spec-compliant API endpoint
        await taskApi.createForUser(userId, {
          title: title.trim(),
          description: description.trim() || '',
          status
        });
      } else {
        // Fallback to the old endpoint if we can't get user ID
        await taskApi.create({
          title: title.trim(),
          description: description.trim() || '',
          status
        });
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the task');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-0">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            ← Back to Dashboard
          </Link>

          <TaskForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            status={status}
            setStatus={setStatus}
            error={error}
            onSubmit={handleSubmit}
            submitText="Create Task"
          />
          <div className="mt-4">
            <Button href="/" variant="outline" size="md">
              Cancel
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}