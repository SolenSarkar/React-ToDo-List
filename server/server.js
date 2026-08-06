import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import todoRoutes from './routes/todos.js';

// Load .env from the server/ directory explicitly, so the backend works even
// when it is started from the repo root (e.g. `node server/server.js`).
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins for CORS
const allowedOrigins = [
  process.env.CLIENT_URL, // e.g. https://Solensarkar.github.io/React-ToDo-List/
  'https://solensarkar.github.io', // bare GitHub Pages origin (Origin header has no path)
  'http://localhost:5173', // Vite dev server
  'http://127.0.0.1:5173',
].filter(Boolean);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman, same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS')); // eslint-disable-line prefer-promise-reject-errors
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('🚀 To-Do API is running. See /api/todos');
});

// Handle non-GET requests to the root (e.g. naive POST to the bare domain)
// gracefully with a helpful JSON hint instead of a raw 404.
app.all('/', (req, res) => {
  res
    .status(404)
    .json({
      message:
        'To-Do API endpoint not found. Use /api/todos for todo operations.',
    });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

