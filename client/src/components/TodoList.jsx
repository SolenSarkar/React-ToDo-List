import TodoItem from './TodoItem.jsx';

export default function TodoList({
  todos = [],
  onToggle,
  onEdit,
  onDelete,
}) {
  // Make sure todos is always an array
  const safeTodos = Array.isArray(todos) ? todos : [];

  if (safeTodos.length === 0) {
    return null;
  }

  return (
    <ul className="todo-list">
      {safeTodos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

