import { useState, useEffect, useCallback } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import AuthPage from './pages/AuthPage.jsx';
import TodoForm from './components/TodoForm.jsx';
import TodoList from './components/TodoList.jsx';
import TodoFilter from './components/TodoFilter.jsx';
import Pagination from './components/Pagination.jsx';

import './App.css';


// ======================================================
// API CONFIGURATION
// ======================================================

// In development, Vite proxies /api to the Express backend.
// In production, VITE_API_URL should point to your hosted backend.

let apiUrl = import.meta.env.VITE_API_URL || '/api/todos';

if (apiUrl && !apiUrl.endsWith('/api/todos')) {
  apiUrl = apiUrl.replace(/\/+$/, '') + '/api/todos';
}

const API_URL = apiUrl;

const ITEMS_PER_PAGE = 5;


// ======================================================
// TODO APP
// ======================================================

function TodoApp({ user, onLogout }) {

  const [todos, setTodos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [filter, setFilter] = useState('all');

  const [page, setPage] = useState(1);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const [counts, setCounts] = useState({
    all: 0,
    active: 0,
    completed: 0,
  });


  // ======================================================
  // FETCH TODOS
  // ======================================================

  const fetchTodos = useCallback(
    async (requestedPage, requestedFilter) => {

      try {

        setLoading(true);
        setError('');

        const params = new URLSearchParams({
          page: String(requestedPage),
          limit: String(ITEMS_PER_PAGE),
          status: requestedFilter,
        });

        const token = localStorage.getItem('token');

        const res = await fetch(
          `${API_URL}?${params}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        // ----------------------------------------------
        // Handle API errors
        // ----------------------------------------------

        if (!res.ok) {

          const data = await res
            .json()
            .catch(() => ({}));

          throw new Error(
            data.message ||
            'Failed to load todos'
          );
        }


        // ----------------------------------------------
        // Read response
        // ----------------------------------------------

        const data = await res.json();


        // ----------------------------------------------
        // Todos
        // ----------------------------------------------

        setTodos(
          Array.isArray(data.todos)
            ? data.todos
            : []
        );


        // ----------------------------------------------
        // Total
        // ----------------------------------------------

        setTotal(
          typeof data.total === 'number'
            ? data.total
            : 0
        );


        // ----------------------------------------------
        // Total pages
        // ----------------------------------------------

        const backendTotalPages =
          typeof data.totalPages === 'number' &&
          data.totalPages > 0
            ? data.totalPages
            : 1;

        setTotalPages(
          backendTotalPages
        );


        // ----------------------------------------------
        // Counts
        // ----------------------------------------------

        setCounts({
          all: data.counts?.all ?? 0,
          active: data.counts?.active ?? 0,
          completed: data.counts?.completed ?? 0,
        });


        // ----------------------------------------------
        // Handle invalid page
        // ----------------------------------------------

        if (
          requestedPage >
          backendTotalPages
        ) {
          setPage(
            backendTotalPages
          );
        }

      } catch (err) {

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load todos'
        );

      } finally {

        setLoading(false);

      }

    },
    []
  );


  // ======================================================
  // FETCH WHEN PAGE OR FILTER CHANGES
  // ======================================================

  useEffect(() => {

    fetchTodos(
      page,
      filter
    );

  }, [
    fetchTodos,
    page,
    filter,
  ]);


  // ======================================================
  // ADD TODO
  // ======================================================

  const addTodo = async (text) => {
  try {
    setError('');

    const trimmedText = text.trim();

    if (!trimmedText) {
      setError('Todo title is required');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setError('You are not logged in');
      return;
    }

    const res = await fetch(API_URL, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        title: trimmedText,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        data.message || 'Failed to add todo'
      );
    }

    // Go back to first page
    setPage(1);

    // Refresh todos
    await fetchTodos(1, filter);

  } catch (err) {
    console.error('Add todo error:', err);

    setError(
      err instanceof Error
        ? err.message
        : 'Failed to add todo'
    );
  }
};


  // ======================================================
  // TOGGLE TODO
  // ======================================================

  const toggleTodo = async (id) => {

    const target = todos.find(
      (todo) =>
        todo._id === id
    );

    if (!target) {
      return;
    }


    const newCompleted =
      !target.completed;


    // ----------------------------------------------
    // Optimistic update
    // ----------------------------------------------

    setTodos((prev) =>
      prev.map((todo) =>
        todo._id === id
          ? {
              ...todo,
              completed:
                newCompleted,
            }
          : todo
      )
    );


    try {

      setError('');

      const token =
        localStorage.getItem('token');


      const res = await fetch(
        `${API_URL}/${id}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            completed:
              newCompleted,
          }),
        }
      );


      if (!res.ok) {

        const data = await res
          .json()
          .catch(() => ({}));

        throw new Error(
          data.message ||
          'Failed to update todo'
        );
      }


      // Refresh list
      await fetchTodos(
        page,
        filter
      );

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update todo'
      );


      // ----------------------------------------------
      // Roll back optimistic update
      // ----------------------------------------------

      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === id
            ? {
                ...todo,
                completed:
                  target.completed,
              }
            : todo
        )
      );

    }

  };


  // ======================================================
  // EDIT TODO
  // ======================================================

  const editTodo = async (
    id,
    newText
  ) => {

    const trimmed =
      newText.trim();

    if (!trimmed) {
      return;
    }


    try {

      setError('');

      const token =
        localStorage.getItem('token');


      const res = await fetch(
        `${API_URL}/${id}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: trimmed,
          }),
        }
      );


      if (!res.ok) {

        const data = await res
          .json()
          .catch(() => ({}));

        throw new Error(
          data.message ||
          'Failed to edit todo'
        );
      }


      const updated =
        await res.json();


      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === id
            ? updated
            : todo
        )
      );

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to edit todo'
      );

    }

  };


  // ======================================================
  // DELETE TODO
  // ======================================================

  const deleteTodo = async (id) => {

    try {

      setError('');

      const token =
        localStorage.getItem('token');


      const res = await fetch(
        `${API_URL}/${id}`,
        {
          method: 'DELETE',

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      if (!res.ok) {

        const data = await res
          .json()
          .catch(() => ({}));

        throw new Error(
          data.message ||
          'Failed to delete todo'
        );
      }


      // Refresh after deletion
      await fetchTodos(
        page,
        filter
      );

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to delete todo'
      );

    }

  };


  // ======================================================
  // PAGINATION
  // ======================================================

  const handlePageChange = (
    newPage
  ) => {

    if (newPage < 1) {
      return;
    }

    if (newPage > totalPages) {
      return;
    }

    setPage(newPage);

  };


  // ======================================================
  // FILTER
  // ======================================================

  const handleFilterChange = (
    newFilter
  ) => {

    if (newFilter === filter) {
      return;
    }

    setFilter(newFilter);

    // Reset pagination
    setPage(1);

  };


  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="app">


      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="app-header">

  <div className="header-content">

    <div className="user-section">

      <span className="welcome-user">
        Welcome, {user?.name || user?.email || 'User'}
      </span>

      <button
        type="button"
        className="logout-button"
        onClick={onLogout}
      >
        Logout
      </button>

    </div>
    <div>
      <h1>📝 To-Do List</h1>

      <p className="subtitle">
        MERN Stack Task Manager
      </p>
    </div>

    

  </div>

</header>


      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="app-main">


        {/* ----------------------------------------------
            ERROR
        ---------------------------------------------- */}

        {error && (

          <div className="error-banner">

            {error}

          </div>

        )}


        {/* ----------------------------------------------
            TODO FORM
        ---------------------------------------------- */}

        <TodoForm
          onAdd={addTodo}
        />


        {/* ----------------------------------------------
            FILTER
        ---------------------------------------------- */}

        <TodoFilter
          filter={filter}
          onFilterChange={
            handleFilterChange
          }
          counts={counts}
        />


        {/* ----------------------------------------------
            TODO LIST
        ---------------------------------------------- */}

        {loading ? (

          <div className="loading">

            Loading todos…

          </div>

        ) : (

          <TodoList
            todos={todos}
            onToggle={toggleTodo}
            onEdit={editTodo}
            onDelete={deleteTodo}
          />

        )}


        {/* ----------------------------------------------
            EMPTY MESSAGE
        ---------------------------------------------- */}

        {!loading &&
          todos.length === 0 && (

            <p className="empty-message">

              {total === 0
                ? 'No todos yet. Add one above! 🎯'
                : 'No todos in this filter.'}

            </p>

        )}


        {/* ----------------------------------------------
            PAGINATION
        ---------------------------------------------- */}

        {!loading &&
          total > 0 && (

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={
                handlePageChange
              }
            />

        )}

      </main>


      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="app-footer">

        {counts?.active ?? 0}

        {' active • '}

        {counts?.completed ?? 0}

        {' completed'}

      </footer>

    </div>

  );

}


// ======================================================
// PROTECTED TODO APP
// ======================================================

function ProtectedTodoApp() {

  const [user, setUser] =
    useState(() => {

      const savedUser =
        localStorage.getItem(
          'user'
        );


      if (!savedUser) {
        return null;
      }


      try {

        return JSON.parse(
          savedUser
        );

      } catch {

        localStorage.removeItem(
          'user'
        );

        localStorage.removeItem(
          'token'
        );

        return null;

      }

    });


  // ====================================================
  // LOGIN
  // ====================================================

  const handleLogin = (
    loggedInUser
  ) => {

    // Save user
    localStorage.setItem(
      'user',
      JSON.stringify(
        loggedInUser
      )
    );


    // Immediately update React state
    setUser(
      loggedInUser
    );

  };


  // ====================================================
  // LOGOUT
  // ====================================================

  const handleLogout = () => {

    // Remove authentication
    localStorage.removeItem(
      'user'
    );

    localStorage.removeItem(
      'token'
    );


    // Immediately return to AuthPage
    setUser(null);

  };


  // ====================================================
  // NOT LOGGED IN
  // ====================================================

  if (!user) {

    return (

      <AuthPage
        onLogin={handleLogin}
      />

    );

  }


  // ====================================================
  // LOGGED IN
  // ====================================================

  return (

    <TodoApp
      user={user}
      onLogout={handleLogout}
    />

  );

}


// ======================================================
// APP ROUTER
// ======================================================

export default function App() {

  return (

    <BrowserRouter
      basename="/React-ToDo-List"
    >

      <Routes>

        {/* ==============================================
            MAIN APPLICATION
        ============================================== */}

        <Route
          path="/"
          element={
            <ProtectedTodoApp />
          }
        />


        {/* ==============================================
            Any unknown URL goes back to home
        ============================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}