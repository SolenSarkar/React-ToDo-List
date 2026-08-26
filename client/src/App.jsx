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

let apiUrl =
  import.meta.env.VITE_API_URL || '/api/todos';

if (
  apiUrl &&
  !apiUrl.endsWith('/api/todos')
) {
  apiUrl =
    apiUrl.replace(/\/+$/, '') +
    '/api/todos';
}

const API_URL = apiUrl;

const ITEMS_PER_PAGE = 5;


// ======================================================
// TODO APP
// ======================================================

function TodoApp({
  user,
  onLogout,
}) {

  const [todos, setTodos] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [filter, setFilter] =
    useState('all');

  const [page, setPage] =
    useState(1);

  const [total, setTotal] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  const [counts, setCounts] =
    useState({
      all: 0,
      active: 0,
      completed: 0,
    });


  // ====================================================
  // FETCH TODOS
  // ====================================================

  const fetchTodos = useCallback(
    async (
      requestedPage,
      requestedFilter
    ) => {

      try {

        setLoading(true);
        setError('');

        const params =
          new URLSearchParams({
            page: String(
              requestedPage
            ),

            limit: String(
              ITEMS_PER_PAGE
            ),

            status:
              requestedFilter,
          });


        const token =
          localStorage.getItem(
            'token'
          );


        if (!token) {

          throw new Error(
            'Authentication token not found'
          );

        }


        const res = await fetch(
          `${API_URL}?${params}`,
          {
            method: 'GET',

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


        // ----------------------------------------------
        // Read response
        // ----------------------------------------------

        const responseText =
          await res.text();


        // ----------------------------------------------
        // Handle error
        // ----------------------------------------------

        if (!res.ok) {

          let errorData = {};

          try {

            errorData =
              JSON.parse(
                responseText
              );

          } catch {
            // Response isn't JSON
          }


          throw new Error(
            errorData.message ||
            `Failed to load todos (${res.status})`
          );

        }


        // ----------------------------------------------
        // Parse response
        // ----------------------------------------------

        let data;

        try {

          data =
            JSON.parse(
              responseText
            );

        } catch {

          throw new Error(
            'Invalid response from server'
          );

        }


        console.log(
          'GET /api/todos response:',
          data
        );


        // ==================================================
        // IMPORTANT
        //
        // Your backend returns:
        //
        // [
        //   { _id, title, completed },
        //   { _id, title, completed }
        // ]
        //
        // NOT:
        //
        // {
        //   todos: [...]
        // }
        // ==================================================

        const allTodos =
          Array.isArray(data)
            ? data
            : Array.isArray(
                data.todos
              )
              ? data.todos
              : [];


        console.log(
          'Todos received:',
          allTodos
        );


        // ==================================================
        // FILTER TODOS
        // ==================================================

        let filteredTodos =
          allTodos;


        if (
          requestedFilter ===
          'active'
        ) {

          filteredTodos =
            allTodos.filter(
              (todo) =>
                !todo.completed
            );

        }


        if (
          requestedFilter ===
          'completed'
        ) {

          filteredTodos =
            allTodos.filter(
              (todo) =>
                todo.completed
            );

        }


        // ==================================================
        // COUNTS
        // ==================================================

        const allCount =
          allTodos.length;


        const completedCount =
          allTodos.filter(
            (todo) =>
              todo.completed
          ).length;


        const activeCount =
          allTodos.filter(
            (todo) =>
              !todo.completed
          ).length;


        setCounts({
          all: allCount,
          active: activeCount,
          completed:
            completedCount,
        });


        // ==================================================
        // PAGINATION
        // ==================================================

        const calculatedTotal =
          filteredTodos.length;


        const calculatedTotalPages =
          Math.max(
            1,
            Math.ceil(
              calculatedTotal /
                ITEMS_PER_PAGE
            )
          );


        setTotal(
          calculatedTotal
        );


        setTotalPages(
          calculatedTotalPages
        );


        // ----------------------------------------------
        // Make sure page is valid
        // ----------------------------------------------

        let safePage =
          requestedPage;


        if (
          requestedPage >
          calculatedTotalPages
        ) {

          safePage =
            calculatedTotalPages;

          setPage(
            calculatedTotalPages
          );

        }


        // ==================================================
        // PAGINATE
        // ==================================================

        const startIndex =
          (safePage - 1) *
          ITEMS_PER_PAGE;


        const paginatedTodos =
          filteredTodos.slice(
            startIndex,
            startIndex +
              ITEMS_PER_PAGE
          );


        console.log(
          'Todos displayed:',
          paginatedTodos
        );


        // ==================================================
        // SET TODOS
        // ==================================================

        setTodos(
          paginatedTodos
        );

      } catch (err) {

        console.error(
          'Fetch todos error:',
          err
        );


        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load todos'
        );


        setTodos([]);

      } finally {

        setLoading(false);

      }

    },
    []
  );


  // ====================================================
  // FETCH WHEN PAGE / FILTER CHANGES
  // ====================================================

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


  // ====================================================
  // ADD TODO
  // ====================================================

  const addTodo = async (
    text
  ) => {

    try {

      setError('');


      const trimmedText =
        text.trim();


      if (!trimmedText) {

        setError(
          'Todo title is required'
        );

        return;

      }


      const token =
        localStorage.getItem(
          'token'
        );


      if (!token) {

        setError(
          'You are not logged in'
        );

        return;

      }


      const res = await fetch(
        API_URL,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          // IMPORTANT:
          // Backend expects "title"
          body: JSON.stringify({
            title: trimmedText,
          }),
        }
      );


      const responseText =
        await res.text();


      let data = {};

      try {

        data =
          JSON.parse(
            responseText
          );

      } catch {
        // Response isn't JSON
      }


      if (!res.ok) {

        throw new Error(
          data.message ||
          `Failed to add todo (${res.status})`
        );

      }


      console.log(
        'POST /api/todos response:',
        data
      );


      // ----------------------------------------------
      // Go to first page
      // ----------------------------------------------

      setPage(1);


      // ----------------------------------------------
      // Refresh todos
      // ----------------------------------------------

      await fetchTodos(
        1,
        filter
      );

    } catch (err) {

      console.error(
        'Add todo error:',
        err
      );


      setError(
        err instanceof Error
          ? err.message
          : 'Failed to add todo'
      );

    }

  };


  // ====================================================
  // TOGGLE TODO
  // ====================================================

  const toggleTodo = async (
    id
  ) => {

    const target =
      todos.find(
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
        localStorage.getItem(
          'token'
        );


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


      const responseText =
        await res.text();


      let data = {};

      try {

        data =
          JSON.parse(
            responseText
          );

      } catch {
        // Response isn't JSON
      }


      if (!res.ok) {

        throw new Error(
          data.message ||
          'Failed to update todo'
        );

      }


      // ----------------------------------------------
      // Refresh
      // ----------------------------------------------

      await fetchTodos(
        page,
        filter
      );

    } catch (err) {

      console.error(
        'Toggle todo error:',
        err
      );


      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update todo'
      );


      // ----------------------------------------------
      // Rollback
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


  // ====================================================
  // EDIT TODO
  // ====================================================

  const editTodo = async (
    id,
    newText
  ) => {

    const trimmed =
      newText.trim();


    if (!trimmed) {

      setError(
        'Todo title is required'
      );

      return;

    }


    try {

      setError('');


      const token =
        localStorage.getItem(
          'token'
        );


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

          // IMPORTANT:
          // Backend expects "title"
          body: JSON.stringify({
            title: trimmed,
          }),
        }
      );


      const responseText =
        await res.text();


      let data = {};

      try {

        data =
          JSON.parse(
            responseText
          );

      } catch {
        // Response isn't JSON
      }


      if (!res.ok) {

        throw new Error(
          data.message ||
          'Failed to edit todo'
        );

      }


      console.log(
        'PUT /api/todos response:',
        data
      );


      // ----------------------------------------------
      // Refresh from backend
      // ----------------------------------------------

      await fetchTodos(
        page,
        filter
      );

    } catch (err) {

      console.error(
        'Edit todo error:',
        err
      );


      setError(
        err instanceof Error
          ? err.message
          : 'Failed to edit todo'
      );

    }

  };


  // ====================================================
  // DELETE TODO
  // ====================================================

  const deleteTodo = async (
    id
  ) => {

    try {

      setError('');


      const token =
        localStorage.getItem(
          'token'
        );


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


      const responseText =
        await res.text();


      let data = {};

      try {

        data =
          JSON.parse(
            responseText
          );

      } catch {
        // Response isn't JSON
      }


      if (!res.ok) {

        throw new Error(
          data.message ||
          'Failed to delete todo'
        );

      }


      // ----------------------------------------------
      // Refresh
      // ----------------------------------------------

      await fetchTodos(
        page,
        filter
      );

    } catch (err) {

      console.error(
        'Delete todo error:',
        err
      );


      setError(
        err instanceof Error
          ? err.message
          : 'Failed to delete todo'
      );

    }

  };


  // ====================================================
  // PAGINATION
  // ====================================================

  const handlePageChange = (
    newPage
  ) => {

    if (
      newPage < 1 ||
      newPage > totalPages
    ) {
      return;
    }


    setPage(
      newPage
    );

  };


  // ====================================================
  // FILTER
  // ====================================================

  const handleFilterChange = (
    newFilter
  ) => {

    if (
      newFilter === filter
    ) {
      return;
    }


    setFilter(
      newFilter
    );


    setPage(1);

  };


  // ====================================================
  // UI
  // ====================================================

  return (

    <div className="app">


      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="app-header">

        <div className="header-content">

          
          <div>
            {/* ----------------------------------------------
              USER + LOGOUT
          ---------------------------------------------- */}

          <div className="user-section">

            <span className="welcome-user">

              Welcome,{' '}

              {user?.name ||
                user?.username ||
                user?.email ||
                'User'}

            </span>


            <button
              type="button"
              className="logout-button"
              onClick={onLogout}
            >
              Logout
            </button>

          </div>

            <h1>
              📝 To-Do List
            </h1>

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
            ADD TODO
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

        {counts.active}

        {' active • '}

        {counts.completed}

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

    console.log(
      'User logged in:',
      loggedInUser
    );


    // Save user immediately

    localStorage.setItem(
      'user',
      JSON.stringify(
        loggedInUser
      )
    );


    // Update React immediately

    setUser(
      loggedInUser
    );

  };


  // ====================================================
  // LOGOUT
  // ====================================================

  const handleLogout = () => {

    localStorage.removeItem(
      'user'
    );

    localStorage.removeItem(
      'token'
    );


    // Immediately show AuthPage

    setUser(null);

  };


  // ====================================================
  // NOT LOGGED IN
  // ====================================================

  if (!user) {

    return (

      <AuthPage
        onLogin={
          handleLogin
        }
      />

    );

  }


  // ====================================================
  // LOGGED IN
  // ====================================================

  return (

    <TodoApp
      user={user}
      onLogout={
        handleLogout
      }
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

        <Route
          path="/"
          element={
            <ProtectedTodoApp />
          }
        />


        {/* Unknown routes return home */}

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