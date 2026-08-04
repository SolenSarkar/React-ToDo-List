import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);

  const startEdit = () => {
    setDraft(todo.text);
    setEditing(true);
  };

  const saveEdit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return; // keep editing if empty
    onEdit(todo._id, trimmed);
    setEditing(false);
  };

  const cancelEdit = () => {
    setDraft(todo.text);
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
          className="todo-text editing"
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span
          className={`todo-text${todo.completed ? ' completed' : ''}`}
          onClick={() => onToggle(todo._id)}
          onDoubleClick={startEdit}
        >
          {todo.text}
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

