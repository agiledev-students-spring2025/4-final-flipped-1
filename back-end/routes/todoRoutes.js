import express from 'express';
import { body, validationResult } from 'express-validator';
import Todo from '../models/ToDo.js';
import passport from 'passport';

const router = express.Router();

// GET: 当前用户的 todos
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.user_id; // 来自 decoded token
    const todos = await Todo.find({ user_id: userId });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'failed to fetch todos', error: err });
  }
});

// POST: 新增 todo
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  [
    body('date').isString().notEmpty().withMessage('Date is required'),
    body('toDo').isString().notEmpty().withMessage('To-do content is required'),
    body('startTime').isString().notEmpty().withMessage('Start time is required'),
    body('endTime').isString().notEmpty().withMessage('End time is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'validation failed', errors: errors.array() });
    }

    const { date, toDo, startTime, endTime } = req.body;
    const userId = req.user.user_id;
    try {
      const newTodo = new Todo({
        user_id: userId,
        date,
        toDo,
        startTime,
        endTime,
      });
      const saved = await newTodo.save();
      res.json(saved);
    } catch (err) {
      res.status(400).json({ message: 'failed to add todo', error: err });
    }
  }
);

// DELETE: 删除 todo
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.user_id;
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (todo.user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this todo' });
    }

    const deleted = await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted', deleted });
  } catch (err) {
    res.status(400).json({ message: 'Delete failed', error: err });
  }
});

export default router;
