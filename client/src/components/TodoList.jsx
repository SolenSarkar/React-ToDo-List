import TodoItem from './TodoItem.jsx';

export default function TodoList({ todos, onToggle, onEdit, onDelete }) {
  if (todos.length === 0) return null;

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
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

