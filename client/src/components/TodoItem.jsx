import { useState } from 'react';

export default function TodoItem({
  todo,
  onToggle,
  onEdit,
  onDelete,
}) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(
    todo.title ?? todo.text ?? ''
  );

  const handleSave = () => {
    const trimmed = editText.trim();

    if (!trimmed) {
      return;
    }

    onEdit(todo._id, trimmed);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditText(
      todo.title ?? todo.text ?? ''
    );

    setEditing(false);
  };

  return (
    <li
      className={
        todo.completed
          ? 'todo-item completed'
          : 'todo-item'
      }
    >

      {/* Checkbox */}
      <input
        type="checkbox"
        checked={Boolean(todo.completed)}
        onChange={() =>
          onToggle(todo._id)
        }
      />


      {/* Todo content */}
      <div className="todo-content">

        {editing ? (

          <input
            type="text"
            value={editText}
            onChange={(e) =>
              setEditText(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }

              if (e.key === 'Escape') {
                handleCancel();
              }
            }}
            autoFocus
            className="todo-edit-input"
          />

        ) : (

          <span
            className={
              todo.completed
                ? 'todo-title completed'
                : 'todo-title'
            }
          >
            {todo.title ??
              todo.text ??
              'Untitled Todo'}
          </span>

        )}

      </div>


      {/* Buttons */}
      <div className="todo-actions">

        {editing ? (

          <>
            <button
              type="button"
              onClick={handleSave}
              className="save-button"
            >
              Save
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
            >
              Cancel
            </button>
          </>

        ) : (

          <>
            <button
              type="button"
              onClick={() =>
                setEditing(true)
              }
              className="edit-button"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() =>
                onDelete(todo._id)
              }
              className="delete-button"
            >
              Delete
            </button>
          </>

        )}

      </div>

    </li>
  );
}