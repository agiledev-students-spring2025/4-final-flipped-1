import express from 'express';
import passport from 'passport';
import FlipLog from '../models/FlipLog.js';

const fliplogRouter = () => {
  const router = express.Router();

  router.get('/api/date/:date', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { date } = req.params;
    const user_id = req.user.user_id;

    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    try {
      const logs = await FlipLog.find({
        start_time: { $gte: start, $lte: end }
      });
      res.json(logs);
    } catch (err) {
      console.error("Error fetching flip logs:", err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
};

export default fliplogRouter;
