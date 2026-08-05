import express from 'express';
import Todo from '../models/Todo.js';

const router = express.Router();

// GET /api/todos — fetch all todos (newest first) with pagination
// Query params: page (default 1), limit (default 5), status (all|active|completed)
router.get('/', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 5, 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};
    const status = req.query.status;
    if (status === 'active') filter.completed = false;
    if (status === 'completed') filter.completed = true;

    const [todos, total, totalAll, totalActive, totalCompleted] =
      await Promise.all([
        Todo.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Todo.countDocuments(filter),
        Todo.countDocuments({}),
        Todo.countDocuments({ completed: false }),
        Todo.countDocuments({ completed: true }),
      ]);

    res.json({
      todos,
      total,
      page,
      limit,
      totalPages: Math.max(Math.ceil(total / limit), 1),
      counts: {
        all: totalAll,
        active: totalActive,
        completed: totalCompleted,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/todos — create a new todo
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Todo text is required' });
    }
    const todo = await Todo.create({ text: text.trim() });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/todos/:id — update text and/or completed
router.put('/:id', async (req, res) => {
  try {
    const { text, completed } = req.body;
    const update = {};

    if (text !== undefined) {
      if (!text.trim()) {
        return res.status(400).json({ message: 'Todo text cannot be empty' });
      }
      update.text = text.trim();
    }
    if (completed !== undefined) update.completed = completed;

    const todo = await Todo.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/todos/:id — remove a todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
