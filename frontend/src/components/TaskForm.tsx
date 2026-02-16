import { Task } from '@/types/task';

interface TaskFormProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  status: 'pending' | 'in-progress' | 'completed';
  setStatus: (status: 'pending' | 'in-progress' | 'completed') => void;
  error?: string;
  onSubmit: (e: React.FormEvent) => void;
  submitText?: string;
  isEditing?: boolean;
  onCancel?: () => void;
}

export default function TaskForm({
  title,
  setTitle,
  description,
  setDescription,
  status,
  setStatus,
  error,
  onSubmit,
  submitText = 'Create Task',
  isEditing = false,
  onCancel
}: TaskFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-white shadow-md rounded-lg p-6">
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter task title"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter task description (optional)"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <div className="flex flex-col sm:flex-row sm:space-x-4 mt-2 space-y-2 sm:space-y-0">
          {(['pending', 'in-progress', 'completed'] as const).map((option) => (
            <label key={option} className="inline-flex items-center">
              <input
                type="radio"
                name="status"
                checked={status === option}
                onChange={() => setStatus(option)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">
                {option.replace('-', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-3 sm:space-y-0">
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
}