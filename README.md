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

### Deploying the backend (on Render)

GitHub Pages is **static-only**, so the Express + MongoDB backend must be hosted separately. The free tier of [Render](https://render.com) works well.

### Option A — Render Blueprint (recommended, auto-deploys the `server/` subfolder)

This repo includes a **`render.yaml`** Blueprint at the root. It tells Render to build & run the backend from the `server/` subfolder.

1. In Render, choose **New → Blueprint** and connect this repo.
2. Render reads `render.yaml` and creates the web service `react-todo-backend` (build: `npm install`, start: `npm start`, root dir: `server`).
3. Set the two **secret** env vars in the service (Settings → Environment). They are intentionally **not** stored in `render.yaml`:
   ```
   MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/todoapp
   CLIENT_URL=https://Solensarkar.github.io/React-ToDo-List/
   ```
   > `CLIENT_URL` tells the backend which origin may call it. The server whitelists this plus localhost dev origins in CORS.

### Option B — Manual Web Service

1. **Create a new Web Service** on Render and point it at this repo (or push the `server/` folder to its own repo).
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Root directory:** `server` (if using the monorepo)
2. **Set the same environment variables** as above (`PORT`, `MONGODB_URI`, `CLIENT_URL`).

3. **Copy your Render URL** — it will look like `https://todo-backend.onrender.com`.

4. **Tell the frontend to use it.** Add a repo **secret** `VITE_API_URL`:
   - Repo → **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `VITE_API_URL`
   - Value: `https://todo-backend.onrender.com/api/todos` (include `/api/todos`)

5. **Re-run the deploy workflow** (Actions → Deploy to GitHub Pages → Run workflow). The built frontend will now call your hosted API.

> ✅ **You must add the `VITE_API_URL` secret.** Without it, the deployed frontend falls back to `/api/todos` on GitHub Pages, which returns HTML — causing the `Unexpected token '<'` error when adding a todo. Dev mode still proxies `/api` to `localhost:5000`, so local development is unaffected.

---

Built with ❤️ using React, Vite, Express, Mongoose & MongoDB.

