import express from 'express';
import { body, validationResult } from 'express-validator';
import Todo from '../models/ToDo.js';

const router = express.Router();

// GET: 获取所有 todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'failed to fetch todos', error: err });
  }
});

// POST: 新增 todo，含数据验证
router.post(
  '/',
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
    try {
      const newTodo = new Todo({
        user_id: 'test_user',
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
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted', deleted });
  } catch (err) {
    res.status(400).json({ message: 'Delete failed', error: err });
  }
});

export default router;
