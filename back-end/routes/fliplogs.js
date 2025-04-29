import express from 'express';
import FlipLog from '../models/FlipLog.js';    // 确保路径和模型名字对得上
const router = express.Router();


router.get('/', async (req, res) => {
  const { date } = req.query; 
  if (!date) return res.status(400).json({ error: 'date parameter is required' });


  const start = new Date(date);
  const end = new Date(date);
  end.setDate(end.getDate() + 1);

  try {
    const logs = await FlipLog.find({
      start_time: { $gte: start, $lt: end }
    });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
