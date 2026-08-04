const FILTERS = ['all', 'active', 'completed'];

export default function TodoFilter({ filter, onFilterChange, counts }) {
  return (
    <div className="todo-filter">
      {FILTERS.map((f) => (
        <button
          key={f}
          className={filter === f ? 'active' : ''}
          onClick={() => onFilterChange(f)}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
        </button>
      ))}
    </div>
  );
}

