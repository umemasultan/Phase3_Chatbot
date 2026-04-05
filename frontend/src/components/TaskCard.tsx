import Link from 'next/link';
import { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const getStatusGradient = (status: string) => {
    switch(status) {
      case 'pending':
        return 'from-amber-500 via-orange-500 to-red-500';
      case 'in-progress':
        return 'from-blue-500 via-indigo-500 to-purple-500';
      case 'completed':
        return 'from-emerald-500 via-teal-500 to-cyan-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'in-progress':
        return (
          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'completed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Link href={`/tasks/${task.id}`} className="block group">
      <div className="relative bg-white dark:bg-[#0A1854]/40 rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-[#050E3C]/50 overflow-hidden border border-gray-200/50 dark:border-[#0A1854] transition-all duration-500 transform hover:-translate-y-1 backdrop-blur-sm">
        {/* Animated gradient border on hover */}
        <div className={`absolute inset-0 bg-gradient-to-r ${getStatusGradient(task.status)} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>

        {/* Top accent bar */}
        <div className={`h-1 bg-gradient-to-r ${getStatusGradient(task.status)}`}></div>

        <div className="relative p-6">
          {/* Status badge */}
          <div className="flex items-center justify-between mb-4">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md ${
              task.status === 'pending'
                ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                : task.status === 'in-progress'
                  ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/20'
                  : 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
            }`}>
              {getStatusIcon(task.status)}
              <span className="uppercase tracking-wide">{task.status.replace('-', ' ')}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300 line-clamp-2">
            {task.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
            {task.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-[#0A1854]">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="p-2 bg-gray-100/50 dark:bg-[#050E3C]/50 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-medium">
                {task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <span className="text-xs font-semibold">View</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}