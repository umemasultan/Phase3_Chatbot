interface FilterBarProps {
  currentFilter: 'all' | 'pending' | 'in-progress' | 'completed';
  onFilterChange: (filter: 'all' | 'pending' | 'in-progress' | 'completed') => void;
}

export default function FilterBar({ currentFilter, onFilterChange }: FilterBarProps) {
  const filters = [
    { value: 'all', label: 'All Tasks', icon: '📋', gradient: 'from-slate-600 to-gray-700' },
    { value: 'pending', label: 'Pending', icon: '⏳', gradient: 'from-amber-600 to-orange-700' },
    { value: 'in-progress', label: 'In Progress', icon: '🔄', gradient: 'from-blue-600 to-indigo-700' },
    { value: 'completed', label: 'Completed', icon: '✅', gradient: 'from-emerald-600 to-teal-700' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value as any)}
          className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 overflow-hidden group cursor-pointer ${
            currentFilter === filter.value
              ? 'text-white shadow-lg transform scale-105'
              : 'bg-white/90 dark:bg-slate-800/90 text-gray-700 dark:text-gray-300 hover:shadow-lg border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-xl hover:scale-105 hover:border-transparent'
          }`}
        >
          {currentFilter === filter.value && (
            <>
              <span className={`absolute inset-0 bg-gradient-to-r ${filter.gradient}`}></span>
            </>
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <span className="text-base">{filter.icon}</span>
            <span className="tracking-wide">{filter.label}</span>
          </span>
          {currentFilter !== filter.value && (
            <span className={`absolute inset-0 bg-gradient-to-r ${filter.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></span>
          )}
        </button>
      ))}
    </div>
  );
}