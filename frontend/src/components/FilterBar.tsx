interface FilterBarProps {
  currentFilter: 'all' | 'pending' | 'in-progress' | 'completed';
  onFilterChange: (filter: 'all' | 'pending' | 'in-progress' | 'completed') => void;
}

export default function FilterBar({ currentFilter, onFilterChange }: FilterBarProps) {
  const filters = [
    { value: 'all', label: 'All Tasks', icon: '📋', gradient: 'from-slate-500 to-gray-600' },
    { value: 'pending', label: 'Pending', icon: '⏳', gradient: 'from-amber-500 to-orange-600' },
    { value: 'in-progress', label: 'In Progress', icon: '🔄', gradient: 'from-blue-500 to-indigo-600' },
    { value: 'completed', label: 'Completed', icon: '✅', gradient: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value as any)}
          className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden group ${
            currentFilter === filter.value
              ? 'text-white shadow-2xl transform scale-105'
              : 'bg-white/50 dark:bg-[#0A1854]/50 text-gray-700 dark:text-gray-300 hover:shadow-lg border border-gray-200/50 dark:border-[#0A1854] backdrop-blur-sm hover:scale-102'
          }`}
        >
          {currentFilter === filter.value && (
            <span className={`absolute inset-0 bg-gradient-to-r ${filter.gradient}`}></span>
          )}
          <span className="relative z-10 flex items-center gap-2">
            <span className="text-lg">{filter.icon}</span>
            <span>{filter.label}</span>
          </span>
          {currentFilter !== filter.value && (
            <span className={`absolute inset-0 bg-gradient-to-r ${filter.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></span>
          )}
        </button>
      ))}
    </div>
  );
}