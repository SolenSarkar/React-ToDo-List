import express from 'express';
import Todo from '../models/Todo.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/todos — fetch all todos (newest first) with pagination
// Query params: page (default 1), limit (default 5), status (all|active|completed)

// =====================================
// GET USER'S TODOS
// =====================================
router.get("/", protect, async (req, res) => {
  try {
    const todos = await Todo.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json(todos);
  } catch (error) {
    console.error("Get todos error:", error);

    res.status(500).json({
      message: "Failed to fetch todos",
    });
  }
});


// =====================================
// CREATE TODO
// =====================================
router.post("/", protect, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Todo title is required",
      });
    }

    const todo = await Todo.create({
      title: title.trim(),
      completed: false,
      user: req.userId,
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error("Create todo error:", error);

    res.status(500).json({
      message: "Failed to create todo",
    });
  }
});


// =====================================
// UPDATE TODO
// =====================================
router.put("/:id", protect, async (req, res) => {
  try {
    const { title, completed } = req.body;

    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    if (title !== undefined) {
      todo.title = title;
    }

    if (completed !== undefined) {
      todo.completed = completed;
    }

    await todo.save();

    res.json(todo);
  } catch (error) {
    console.error("Update todo error:", error);

    res.status(500).json({
      message: "Failed to update todo",
    });
  }
});


// =====================================
// DELETE TODO
// =====================================
router.delete("/:id", protect, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.json({
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error("Delete todo error:", error);

    res.status(500).json({
      message: "Failed to delete todo",
    });
  }
});


export default router;
