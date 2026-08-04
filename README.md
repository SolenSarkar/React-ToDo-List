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
| GET    | `/api/todos`        | Fetch all todos                    |
| POST   | `/api/todos`        | Create a todo `{ "text": "..." }`  |
| PUT    | `/api/todos/:id`    | Update text / completed            |
| DELETE | `/api/todos/:id`    | Delete a todo                      |

## 🛠️ Production Build

```bash
cd client
npm run build
```

The static files in `client/dist` can be served by any static host (or by Express with a small addition).

---

Built with ❤️ using React, Vite, Express, Mongoose & MongoDB.

