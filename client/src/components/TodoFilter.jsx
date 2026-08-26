const FILTERS = [
  'all',
  'active',
  'completed',
];

export default function TodoFilter({
  filter = 'all',
  onFilterChange,
  counts = {},
}) {
  const safeCounts = {
    all: counts.all ?? 0,
    active: counts.active ?? 0,
    completed: counts.completed ?? 0,
  };

  return (
    <div className="todo-filter">
      {FILTERS.map((f) => (
        <button
          key={f}
          type="button"
          className={filter === f ? 'active' : ''}
          onClick={() => onFilterChange(f)}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
          {' '}
          ({safeCounts[f]})
        </button>
      ))}
    </div>
  );
}