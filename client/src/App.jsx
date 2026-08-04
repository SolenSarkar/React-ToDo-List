import { useState, useEffect, useCallback } from 'react';
import TodoForm from './components/TodoForm.jsx';
import TodoList from './components/TodoList.jsx';
import TodoFilter from './components/TodoFilter.jsx';
import './App.css';

const API_URL = '/api/todos';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  // Fetch todos from the server
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to load todos');
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Add a new todo
  const addTodo = async (text) => {
    try {
      setError('');
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to add todo');
      }
      const newTodo = await res.json();
      // Prepend the new todo immediately so it shows up instantly.
      setTodos((prev) => [newTodo, ...prev]);
      // Re-sync from the server to guarantee the list matches the backend.
      await fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

// Toggle a todo's completed status
  const toggleTodo = async (id) => {
    const target = todos.find((t) => t._id === id);
    if (!target) return;

    // Optimistic update
    setTodos((prev) =>
      prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
    );

    // When marking as complete, move view to the "Completed" tab
    if (!target.completed) {
      setFilter('completed');
    }
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !target.completed }),
      });
      if (!res.ok) {
        throw new Error('Failed to update todo');
      }
    } catch (err) {
      setError(err.message);
      // Revert on error
      setTodos((prev) =>
        prev.map((t) => (t._id === id ? { ...t, completed: target.completed } : t))
      );
    }
  };

  // Edit a todo's text
  const editTodo = async (id, newText) => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    try {
      setError('');
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to edit todo');
      }
      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      setError('');
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete todo');
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Derived lists based on the active filter
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const counts = {
    all: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

return (
    <div className="app">
      <header className="app-header">
        <h1>📝 To-Do List</h1>
        <p className="subtitle">MERN Stack Task Manager</p>
      </header>

      <main className="app-main">
        {error && <div className="error-banner">{error}</div>}

        <TodoForm onAdd={addTodo} />

        <TodoFilter filter={filter} onFilterChange={setFilter} counts={counts} />

        {loading ? (
          <div className="loading">Loading todos…</div>
        ) : (
          <TodoList
            todos={filteredTodos}
            onToggle={toggleTodo}
            onEdit={editTodo}
            onDelete={deleteTodo}
          />
        )}

        {!loading && filteredTodos.length === 0 && (
          <p className="empty-message">
            {todos.length === 0 ? 'No todos yet. Add one above! 🎯' : 'No todos in this filter.'}
          </p>
        )}

</main>

      <footer className="app-footer">
        {counts.active} active • {counts.completed} completed
      </footer>
    </div>
  );
}

