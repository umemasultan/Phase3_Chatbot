interface FilterBarProps {
  currentFilter: 'all' | 'pending' | 'in-progress' | 'completed';
  onFilterChange: (filter: 'all' | 'pending' | 'in-progress' | 'completed') => void;
}

export default function FilterBar({ currentFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex space-x-4">
      {(['all', 'pending', 'in-progress', 'completed'] as const).map((status) => (
        <button
          key={status}
          onClick={() => onFilterChange(status)}
          className={`px-4 py-2 rounded-md capitalize ${
            currentFilter === status
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {status.replace('-', ' ')}
        </button>
      ))}
    </div>
  );
}