import express from 'express';
import passport from 'passport';
import { body, validationResult } from 'express-validator';
import Task from '../models/Task.js';

const taskRouter = () => {
  const router = express.Router();

  const optionalAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      // console.log("🔍 token raw:", req.headers.authorization);
      // console.log("🔍 user parsed from token:", user);
      // console.log("🔍 error info:", info);
      if (user) {
        req.user = user;
      } else {
        req.user = null;
      }
      next();
    })(req, res, next);
  };

  router.get('/api', optionalAuth, async (req, res) => {
    try {
      let query = {};
  
      //loggined？
      if (req.user) {
        // console.log("User logged in:", req.user.user_id);
        query.user_id = req.user.user_id;
      } else {
        // console.log("No user logged in. Returning public (guest) tasks only.");
        query.user_id = 'all';
      }
  
      const tasks = await Task.find(query);  
      res.json(tasks);  
      // console.log("get tasks and show on the main page")
    } catch (err) {
      console.error("Error fetching tasks:", err);
      res.status(500).send("Error fetching tasks.");
    }
  });

  router.post('/api/add',
    passport.authenticate('jwt', { session: false }),
    [
      body('task_name').isString().notEmpty(),
      body('color').isString().notEmpty(),
    ],
    async (req, res) => {
      console.log("🔍 add task")
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      const { task_name, color } = req.body;
      const user_id = req.user.user_id;
      try {
        const newTask = new Task({ task_name, color, user_id });
        const savedTask = await newTask.save();
        res.status(201).json({ success: true, task: savedTask });
      } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ success: false, message: 'Error creating task' });
      }
    }
  );

  router.post('/api/:taskName/delete', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
    const { taskName } = req.params; 
    const user_id = req.user.user_id;
  
    console.log("delete ",taskName)
  
    try {
      const task = await Task.findOne({ task_name: taskName, user_id: user_id });
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });  
      }
  
      await Task.deleteOne({ task_name: taskName });
      res.status(201).json({ message: 'Task deleted successfully' });  
  
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ message: 'Error deleting task' });
    }
  });

  router.put('/api/:taskName/update',
    passport.authenticate('jwt', { session: false }),
    [
      body('task_name').isString().notEmpty(),
      body('color').isString().notEmpty(),
    ],
    async (req, res) => {
      const { taskName } = req.params;
      const { task_name, color } = req.body;
      const user_id = req.user.user_id;

      console.log("update task:", taskName, "to:", task_name);

      try {
        const task = await Task.findOne({ task_name: taskName, user_id: user_id });
        
        if (!task) {
          return res.status(404).json({ message: 'Task not found' });
        }

        task.task_name = task_name;
        task.color = color;
        const updatedTask = await task.save();
        
        res.json({ success: true, task: updatedTask });
      } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Error updating task' });
      }
    }
  );

  return router

};

export default taskRouter;
