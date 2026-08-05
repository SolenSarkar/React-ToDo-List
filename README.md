# 📝 MERN To-Do List Application

A full-stack To-Do List built with the **MERN** stack: **MongoDB**, **Express**, **React**, and **Node.js**.

## ✨ Features

- ➕ Add new todos
- ✅ Toggle todo status (completed / active)
- ✏️ Inline edit todo text
- 🗑️ Delete individual todos
- 🔍 Filter by **All / Active / Completed** with live counts
- 🧹 Clear all completed todos at once
- 💾 Data persisted in MongoDB Atlas
- 📱 Fully responsive, modern UI

## 📂 Project Structure

```
├── server/          # Express + Mongoose backend
│   ├── models/Todo.js
│   ├── routes/todos.js
│   ├── server.js
│   └── .env
└── client/          # React + Vite frontend
    ├── src/
    │   ├── App.jsx
    │   └── components/
    │       ├── TodoForm.jsx
    │       ├── TodoList.jsx
    │       ├── TodoItem.jsx
    │       └── TodoFilter.jsx
    ├── index.html
    └── vite.config.js
```

## 🔧 Prerequisites

- [Node.js](https://nodejs.org/) v18+ (v22 recommended)
- A MongoDB database — local or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier works)

## 🚀 Getting Started

### 1. Configure the backend

Edit `server/.env` and set your MongoDB connection string:

```
PORT=5000
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@cluster0.xxxxx.mongodb.net/todoapp
```

> For local MongoDB use: `mongodb://127.0.0.1:27017/todoapp`

### 2. Install dependencies

Open two terminals.

**Backend:**

```bash
cd server
npm install
npm run dev
```

**Frontend:**

```bash
cd client
npm install
npm run dev
```

### 3. Open the app

Visit **http://localhost:5173** — the Vite dev server proxies `/api` requests to the backend at **http://localhost:5000**.

## 🔌 API Endpoints

| Method | Endpoint            | Description                        |
| ------ | ------------------- | ---------------------------------- |
| GET    | `/api/todos`        | Fetch all todos (paginated)        |
| POST   | `/api/todos`        | Create a todo `{ "text": "..." }`  |
| PUT    | `/api/todos/:id`    | Update text / completed            |
| DELETE | `/api/todos/:id`    | Delete a todo                      |

> **GET `/api/todos`** supports pagination and filtering via query params:
> `?page=1&limit=5&status=all|active|completed`. It returns:
> `{ todos, total, page, limit, totalPages, counts }` where `counts` holds
> `{ all, active, completed }` totals.

## 🛠️ Production Build

```bash
cd client
npm run build
```

The static files in `client/dist` can be served by any static host (or by Express with a small addition).

## 🚢 Deployment (GitHub Pages)

This repo includes a **GitHub Actions workflow** (`.github/workflows/deploy.yml`) that automatically builds the React app and publishes it to **GitHub Pages** on every push to `main`.

### One-time setup

1. Go to **Settings → Pages** in your repo.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Push a commit to `main` (or run the **Deploy to GitHub Pages** workflow manually from the Actions tab).

The app will be live at:

```
https://SolenSarkar.github.io/React-ToDo-List/
```

### Deploying the backend

GitHub Pages is **static-only**, so the Express + MongoDB backend must be hosted separately (e.g. [Render](https://render.com), [Railway](https://railway.app) or [Cyclic](https://cyclic.sh)):

1. Host the `server/` folder (start command: `npm start`).
2. Set the `MONGODB_URI` env var on the host to your Atlas/local connection string.
3. Add a repo secret `VITE_API_URL` (Settings → Secrets and variables → Actions) containing your hosted backend URL including the path, e.g. `https://todo-backend.onrender.com/api/todos`.
4. Re-run the workflow — the frontend will now call your hosted API.

> Without a hosted backend / `VITE_API_URL`, the deployed site will render the To-Do UI but fail to fetch todos (dev mode still proxies `/api` to `localhost:5000`).

---

Built with ❤️ using React, Vite, Express, Mongoose & MongoDB.

