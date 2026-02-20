'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Task } from '@/types/task';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { taskApi } from '@/lib/api';
import TaskForm from '@/components/TaskForm';
import Button from '@/components/Button';
import { getCurrentUserIdFromToken } from '@/lib/auth';

export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const taskId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);

  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch task from API
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        // Get current user ID and use the new API endpoint
        const userId = getCurrentUserIdFromToken();
        let data;
        if (userId) {
          // Use the new spec-compliant API endpoint
          data = await taskApi.getForUser(userId, taskId);
        } else {
          // Fallback to the old endpoint if we can't get user ID
          data = await taskApi.getById(taskId);
        }
        setTask(data);
        setTitle(data.title);
        setDescription(data.description || '');
        setStatus(data.status);
      } catch (error) {
        console.error('Error fetching task:', error);
        if (error instanceof Error && error.message.includes('404')) {
          setTask(null);
        } else {
          setError(error instanceof Error ? error.message : 'An error occurred while fetching the task');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId, router]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      // Get current user ID and use the new API endpoint
      const userId = getCurrentUserIdFromToken();
      let updatedTask;
      if (userId) {
        // Use the new spec-compliant API endpoint
        updatedTask = await taskApi.updateForUser(userId, taskId, {
          title: title.trim(),
          description: description.trim() || '',
          status
        });
      } else {
        // Fallback to the old endpoint if we can't get user ID
        updatedTask = await taskApi.update(taskId, {
          title: title.trim(),
          description: description.trim() || '',
          status
        });
      }
      setTask(updatedTask);
      setIsEditing(false);
      setError('');
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the task');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      // Get current user ID and use the new API endpoint
      const userId = getCurrentUserIdFromToken();
      if (userId) {
        // Use the new spec-compliant API endpoint
        await taskApi.deleteForUser(userId, taskId);
      } else {
        // Fallback to the old endpoint if we can't get user ID
        await taskApi.delete(taskId);
      }

      // Navigate back to dashboard
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting the task');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-0">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <p>Loading task...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex">
          <Sidebar />
          <div className="flex-1 flex flex-col md:ml-0">
            <Navbar />
            <div className="flex-1 flex items-center justify-center">
              <p>Loading task...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-0">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500">Task not found</p>
              <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {isEditing ? (
            <TaskForm
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              status={status}
              setStatus={setStatus}
              error={error}
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              submitText="Save Changes"
              isEditing={true}
              onCancel={() => {
                setIsEditing(false);
                // Reset form to original values
                setTitle(task.title);
                setDescription(task.description);
                setStatus(task.status);
                setError('');
              }}
            />
          ) : (
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex flex-wrap items-center">
                  <span className="mr-4">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : task.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Created At</p>
                  <p className="text-gray-900">{task.createdAt ? new Date(task.createdAt).toLocaleString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="text-gray-900">{task.updatedAt ? new Date(task.updatedAt).toLocaleString() : 'N/A'}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-3 sm:space-y-0 pt-4 border-t border-gray-200">
                <Button
                  onClick={async () => {
                    try {
                      const userId = getCurrentUserIdFromToken();
                      if (userId) {
                        await taskApi.toggleComplete(userId, taskId);
                        // Refresh task data
                        const updatedTask = await taskApi.getForUser(userId, taskId);
                        setTask(updatedTask);
                        setStatus(updatedTask.status);
                      } else {
                        // Fallback behavior - just change the status locally and save
                        const newStatus = status === 'completed' ? 'pending' : 'completed';
                        setStatus(newStatus);
                        const updatedTask = await taskApi.update(taskId, {
                          title: title.trim(),
                          description: description.trim() || '',
                          status: newStatus
                        });
                        setTask(updatedTask);
                      }
                    } catch (err: any) {
                      setError(err.message || 'An error occurred while updating the task');
                    }
                  }}
                  variant={status === 'completed' ? 'secondary' : 'primary'}
                  size="md"
                >
                  {status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="danger"
                  size="md"
                >
                  Delete Task
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}