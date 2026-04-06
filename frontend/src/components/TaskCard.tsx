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
      <div className="relative bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-slate-900/90 dark:via-slate-800/80 dark:to-slate-900/70 rounded-xl shadow-md hover:shadow-lg dark:shadow-blue-900/20 overflow-hidden border border-white/20 dark:border-slate-700/50 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-xl">

        {/* Animated gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getStatusGradient(task.status)} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

        {/* Top accent bar with gradient */}
        <div className={`h-1 bg-gradient-to-r ${getStatusGradient(task.status)}`}></div>

        <div className="relative p-4">
          {/* Status badge */}
          <div className="flex items-center justify-between mb-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur-xl shadow-sm ${
              task.status === 'pending'
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-300 border border-amber-400/30'
                : task.status === 'in-progress'
                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-300 border border-blue-400/30'
                  : 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-400/30'
            }`}>
              {getStatusIcon(task.status)}
              <span className="uppercase tracking-wider">{task.status.replace('-', ' ')}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all duration-300 line-clamp-2 leading-tight">
            {task.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-xs mb-4 line-clamp-2 leading-relaxed">
            {task.description || 'No description provided'}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200/30 dark:border-slate-700/50">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-600 dark:text-gray-300">
              <div className="p-1.5 bg-gradient-to-br from-gray-100/80 to-gray-200/60 dark:from-slate-800/80 dark:to-slate-700/60 rounded-md backdrop-blur-sm">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-semibold">
                {task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>

            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0">
              <span className="text-[10px] font-bold">View</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}