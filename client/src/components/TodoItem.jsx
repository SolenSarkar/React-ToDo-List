import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);

  const startEdit = () => {
    setDraft(todo.title);
    setEditing(true);
  };

  const saveEdit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return; // keep editing if empty
    onEdit(todo._id, trimmed);
    setEditing(false);
  };

  const cancelEdit = () => {
    setDraft(todo.title);
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  return (
    <li className="todo-item">
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo._id)}
        title="Toggle complete"
      />

      {editing ? (
        <input
          className="todo-title editing"
          type="title"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span
          className={`todo-title${todo.completed ? ' completed' : ''}`}
          onClick={() => onToggle(todo._id)}
          onDoubleClick={startEdit}
        >
          {todo.title}
        </span>
      )}

      <div className="todo-actions">
        {editing ? (
          <>
            <button className="btn-save" onClick={saveEdit}>
              Save
            </button>
            <button className="btn-cancel" onClick={cancelEdit}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className="btn-edit" onClick={startEdit}>
              Edit
            </button>
            <button className="btn-delete" onClick={() => onDelete(todo._id)}>
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}

