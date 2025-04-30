import express from 'express';
import passport from 'passport';
import FlipLog from '../models/FlipLog.js';

const fliplogRouter = () => {
  const router = express.Router();

  router.get('/api/date/:date', (req, res, next) => {
    // console.log("Route matched, before passport");
    next();
  }, passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { date } = req.params;
    const user_id = req.user.user_id;

    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    // console.log("Received fliplog request for", date, "from user", user_id);


    try {
      const logs = await FlipLog.find({
        user_id,
        start_time: { $gte: start, $lte: end }
      });
      res.json(logs);
    } catch (err) {
      console.error("Error fetching flip logs:", err);
      res.status(500).json({ error: 'Server error' });
    }
  });


  router.get('/api/range', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { start, end } = req.query;
    const user_id = req.user.user_id;
  
    if (!start || !end) {
      return res.status(400).json({ error: "Missing start or end date" });
    }
  
    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
  
    try {
      const logs = await FlipLog.find({
        user_id,
        start_time: { $gte: startDate, $lte: endDate }
      });
  
      res.json(logs);
    } catch (err) {
      console.error("Error fetching flip logs range:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
  

  return router;
};

export default fliplogRouter;
