import { useState, useEffect, useCallback } from 'react';
import TodoForm from './components/TodoForm.jsx';
import TodoList from './components/TodoList.jsx';
import TodoFilter from './components/TodoFilter.jsx';
import Pagination from './components/Pagination.jsx';
import './App.css';

const API_URL = '/api/todos';
const ITEMS_PER_PAGE = 5;

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState({ all: 0, active: 0, completed: 0 });

  // Fetch a specific page from the server (paginated + filtered)
  const fetchTodos = useCallback(async (requestedPage, requestedFilter) => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({
        page: requestedPage,
        limit: ITEMS_PER_PAGE,
        status: requestedFilter,
      });
      const res = await fetch(`${API_URL}?${params}`);
      if (!res.ok) throw new Error('Failed to load todos');
      const data = await res.json();
      setTodos(data.todos);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setCounts(data.counts);
      // If the requested page is beyond the last page, clamp it.
      if (requestedPage > data.totalPages) {
        setPage(data.totalPages);
        return; // effect will refetch with the clamped page
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch whenever page or filter changes
  useEffect(() => {
    fetchTodos(page, filter);
  }, [fetchTodos, page, filter]);

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
      setPage(1); // jump to the first page to see the new todo
      fetchTodos(1, filter);
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
      setPage(1);
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
      fetchTodos(page, filter);
    } catch (err) {
      setError(err.message);
      // Revert on error
      setTodos((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, completed: target.completed } : t
        )
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
      fetchTodos(page, filter);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleFilterChange = (newFilter) => {
    if (newFilter === filter) return;
    setFilter(newFilter);
    setPage(1); // reset to first page when filter changes
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

        <TodoFilter
          filter={filter}
          onFilterChange={handleFilterChange}
          counts={counts}
        />

        {loading ? (
          <div className="loading">Loading todos…</div>
        ) : (
          <TodoList
            todos={todos}
            onToggle={toggleTodo}
            onEdit={editTodo}
            onDelete={deleteTodo}
          />
        )}

        {!loading && todos.length === 0 && (
          <p className="empty-message">
            {total === 0
              ? 'No todos yet. Add one above! 🎯'
              : 'No todos in this filter.'}
          </p>
        )}

        {!loading && total > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>

      <footer className="app-footer">
        {counts.active} active • {counts.completed} completed
      </footer>
    </div>
  );
}
