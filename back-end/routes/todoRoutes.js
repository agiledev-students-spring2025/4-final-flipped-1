import express from 'express';
import Todo from '../models/ToDo.js'; // 模型路径

const router = express.Router();

// GET: 获取所有 todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: '获取失败', error: err });
  }
});

// POST: 新增 todo
router.post('/', async (req, res) => {
  const { date, toDo, startTime, endTime } = req.body;
  try {
    const newTodo = new Todo({
      user_id: 'test_user', // 真实项目用 req.user.id
      date,
      toDo,
      startTime,
      endTime,
    });
    const saved = await newTodo.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: '添加失败', error: err });
  }
});

// DELETE: 删除 todo
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: '已删除', deleted });
  } catch (err) {
    res.status(400).json({ message: '删除失败', error: err });
  }
});

export default router;
