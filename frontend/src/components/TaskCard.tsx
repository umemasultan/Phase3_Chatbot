import Link from 'next/link';
import { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <Link href={`/tasks/${task.id}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
        <div className="flex justify-between items-center">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            task.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : task.status === 'in-progress'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
          }`}>
            {task.status.replace('-', ' ')}
          </span>
          <span className="text-sm text-gray-500">
            {task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}