
import express from 'express';
const router = express.Router();


router.get('/', async (req, res) => {
  
  const stats = {
    totalFlips: await FlipLog.countDocuments(),
    totalTasks: await Task.countDocuments(),
    
  };
  res.json(stats);
});

export default router;

