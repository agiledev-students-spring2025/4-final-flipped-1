import dotenv from 'dotenv'
dotenv.config()

// import and instantiate express
import express from 'express'
const app = express()
import mongoose from 'mongoose'
import cors from 'cors'
import morgan from 'morgan'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'

//middleware
app.use(morgan('dev'))
// app.use(cors())
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))

// app.use(cors({ origin: 'https://localhost:3000', credentials: true, }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))




// routers
import todoRoutes from './routes/todoRoutes.js';
import cookieRouter from './routes/cookieRouter.js';
import protectedContentRouter from './routes/protectedContentRoutes.js';
import authenticationRouter from './routes/authenticationRoutes.js'

app.use('/auth', authenticationRouter()) // all requests for /auth/* will be handled by the authenticationRoutes router
app.use('/cookie', cookieRouter()) // all requests for /cookie/* will be handled by the cookieRoutes router
app.use('/protected', protectedContentRouter()) // all requests for /protected/* will be handled by the protectedRoutes router


//JWT
import jwtStrategy from './config/jwt-config.js'
passport.use(jwtStrategy)
app.use(passport.initialize())


// import database table
import FlipLog from './models/FlipLog.js';
import Task from './models/Task.js';
import User from './models/User.js';
import ToDo from './models/ToDo.js';


//Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas: flip")
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
  })





// Mock data for todos
// const mockToDos = [
//   { id: 1, date: "2025-02-20", toDo: "Interview with A", startTime: "14:00", endTime: "14:15" },
//   { id: 2, date: "2025-02-26", toDo: "Lunch with B", startTime: "12:30", endTime: "13:15" },
//   { id: 3, date: "2025-02-20", toDo: "Evening Study", startTime: "18:00", endTime: "20:00" },
//   { id: 4, date: "2025-02-23", toDo: "Course A HW", startTime: "20:00", endTime: "21:00" },
//   { id: 5, date: "2025-02-23", toDo: "Gym Session", startTime: "07:30", endTime: "08:30" },
//   { id: 6, date: "2025-02-26", toDo: "Course B", startTime: "16:00", endTime: "18:15" },
//   { id: 7, date: "2025-02-26", toDo: "Course C", startTime: "19:00", endTime: "21:15" },
//   { id: 8, date: "2025-02-26", toDo: "Course D", startTime: "22:00", endTime: "00:15" },
//   { id: 9, date: "2025-03-25", toDo: "Course B", startTime: "16:00", endTime: "18:15" },
//   { id: 10, date: "2025-03-17", toDo: "Course B", startTime: "16:00", endTime: "18:15" }
// ];

// // GET: Return all todos
// app.get('/api/todos', (req, res) => {
//   res.json(mockToDos);
// });

// // POST: Add a new todo
// app.post('/api/todos', (req, res) => {
//   const { date, toDo, startTime, endTime } = req.body;

//   if (!date || !toDo || !startTime || !endTime) {
//     return res.status(400).json({ message: 'All fields are required.' });
//   }

//   const newId = mockToDos.length ? Math.max(...mockToDos.map(todo => todo.id)) + 1 : 1;

//   const newToDo = {
//     id: newId,
//     date,
//     toDo,
//     startTime,
//     endTime
//   };

//   mockToDos.push(newToDo);
//   res.json(newToDo);
// });

// // DELETE: Remove a todo by ID
// app.delete('/api/todos/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const index = mockToDos.findIndex(todo => todo.id === id);

//   if (index !== -1) {
//     const deleted = mockToDos.splice(index, 1);
//     res.json({ message: 'Todo deleted', deleted: deleted[0] });
//   } else {
//     res.status(404).json({ message: 'Todo not found' });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
app.use('/api/todos', todoRoutes); //subtitute mock data




const optionalAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    console.log("🔍 token raw:", req.headers.authorization);
    console.log("🔍 user parsed from token:", user);
    console.log("🔍 error info:", info);
    if (user) {
      req.user = user;
    } else {
      req.user = null; // 未登录也继续
    }
    next();
  })(req, res, next);
};


// API endpoint to get tasks
// 可以用
app.get('/api/tasks', optionalAuth, async (req, res) => {
  try {
<<<<<<< HEAD
    let query = {};

    if (req.user) {
      // loggined
      console.log("✅ User logged in:", req.user.user_id);
      query.user_id = req.user.user_id;
    } else {
      // didn't loggined
      console.log("🚫 No user logged in. Returning public (guest) tasks only.");
      query.user_id = 'all';
    }

    const tasks = await Task.find(query);  
=======
    // Fetch all tasks from the database
    const tasks = await Task.find();
    const formattedTasks = tasks.map(task => ({
      task_id: task._id,
      name: task.task_name,
      color: task.color
    }));
>>>>>>> 4580904b9b810721d277e18bf4c48e940f45281b
    res.json(tasks);  
    // console.log("get tasks and show on the main page")
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).send("Error fetching tasks.");
  }
});


// API endpoint to add a new task
//没加装user id插入
// 目前不能用！会报错！
app.post('/api/tasks', [
  body('task_name').isString().notEmpty(),
  body('color').isString(),
  body('user_id').optional().isString(),
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { task_name, color, user_id } = req.body;

  try {
    const newTask = new Task({
      task_name,
      color,
      user_id: user_id || null
    });

    console.log("add task")
    console.log(newTask)

    const savedTask = await newTask.save();

    res.status(201).json(savedTask);  // 返回创建的任务
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task" });
  }
});

// app.post('/api/tasks', (req, res) => {
//   const { name, color } = req.body;
  
//   // 找到当前最大的 task_id
//   const maxId = mockTasks.reduce((max, task) => {
//     return task.task_id > max ? task.task_id : max;
//   }, 0);

//   const newTask = {
//     task_id: maxId + 1,
//     name,
//     color
//   };

//   mockTasks.push(newTask);
//   res.status(201).json(newTask);
// });

// // Temporary in-memory object to store time (since tasks don't have time tracking yet)
// const taskTimes = {}

// app.post('/api/tasks/:taskId/time', (req, res) => {
//   const { taskId } = req.params;
//   const { timeSpent } = req.body;

//   const task = mockTasks.find(t => t.task_id === Number(taskId));
//   if (!task) {
//     return res.status(404).json({ message: "Task not found" });
//   }

//   // Store time in taskTimes map
//   taskTimes[taskId] = (taskTimes[taskId] || 0) + timeSpent;

//   res.json({
//     success: true,
//     task: {
//       ...task,
//       totalTime: taskTimes[taskId]
//     }
//   });
// });

// API endpoint to update an existing task
// app.put('/api/tasks/:taskId', (req, res) => {
//   const taskId = parseInt(req.params.taskId);
//   const { name, color } = req.body;
  
//   const taskIndex = mockTasks.findIndex(task => task.task_id === taskId);
  
//   if (taskIndex === -1) {
//     return res.status(404).json({ message: 'Task not found' });
//   }

//   // Update the task
//   mockTasks[taskIndex] = {
//     ...mockTasks[taskIndex],
//     name,
//     color
//   };

//   res.json(mockTasks[taskIndex]);
// });




// API endpoint to delete a task
// user login check and preventing 'all' user_id tasks deletion
// 用户没登录不能删，user_id为all的不能删
// 目前不能用！
app.post('/api/tasks/:taskName/delete', async (req, res) => {
  const { taskName } = req.params; 

  console.log("delete ",taskName)
  // const userId = req.user?.id;  // 获取当前登录用户的 user_id (假设通过中间件验证用户并设置)

  // if (!userId) {
  //   return res.status(401).json({ message: 'User not logged in' });  // 如果用户未登录，返回 401 错误
  // }

  try {
    // 查找任务
    const task = await Task.findOne({ task_name: taskName });

    // 任务未找到
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });  
    }

    // 如果任务的 user_id 是 "all"，则不能删除
    if (task.user_id === 'all') {
      return res.status(403).json({ message: 'Cannot delete default user_id "all"' });
    }

    // 如果任务的 user_id 和当前登录的 user_id 不匹配，无法删除
    // 这个在前端不会实现吧除非有人后端抓这个api
    // if (task.user_id !== userId) {
    //   return res.status(403).json({ message: 'You cannot delete this task' });
    // }

    await Task.deleteOne({ task_name: taskName });
    res.status(200).json({ message: 'Task deleted successfully' });  

  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
});






//API real endpoint for insert new log to fliplog table
// 接口，往FlipLog里面插入新的数据，返回该task name, task_name的今日总时长（单位秒）
app.post('/api/fliplog/insert', 
  optionalAuth,
  [
  body('task_name').isString().notEmpty(),
  body('start_time').isISO8601(),
  body('end_time').isISO8601(),
  body('duration').isInt({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { task_name, start_time, end_time, duration } = req.body;
  const roundDuration = Math.floor(duration)

  try {
    const newLog = new FlipLog({
      task_name,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      duration: roundDuration
    });
    
    if (req.user) {
      newLog.user_id = req.user.user_id;

      await newLog.save();

      // 拉今天的日期
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);


      // 查今天这个task的总时长
      const todayLogs = await FlipLog.find({
        task_name,
        start_time: { $gte: startOfDay, $lte: endOfDay }
      });

      const todayTotalTime = todayLogs.reduce((sum, log) => sum + log.duration, 0);

      res.status(201).json({
        success: true,
        taskName: task_name,
        duration: roundDuration,
        log: newLog,
        todayTotalTime,
      });
    } else{
      return res.json({ success: true, fromDB: false, data: newLog });
    }
  } catch (err) {
    console.error("Fail to insert flip log into FlipLog Collection", err);
    res.status(500).json({ error: "server error" });
  }
});


//get today total flip time
//return：task name, today Total Time
//flip before page显示时调用
app.get('/api/today/:taskName', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user) => {
    const { taskName } = req.params;

    // 拉今天的日期
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    
    try {
      let query = {
          task_name: taskName,
          start_time: { $gte: startOfDay, $lte: endOfDay },
        };

        // 如果登录了，就加上 user_id 限定
        if (user) {
          query.user_id = user.user_id;
        } else {
          // 未登录直接返回 0
          return res.json({ taskName, user_id: null, todayTotalTime: 0 });
        }

        const todayLogs = await FlipLog.find(query);
        const todayTotalTime = todayLogs.reduce((sum, log) => sum + log.duration, 0);

        res.json({ taskName, user_id: user.user_id, todayTotalTime });
        console.log(taskName, user.user_id, todayTotalTime);

    } catch (err) {
      console.error("Fail to get today total flip time", err);
      res.status(500).json({ error: 'server error' });
    }
  })(req, res, next); // 🔥 别忘了调用 authenticate 的返回值
});

//get全部flip log
//是不是要改一个输入day / time period返回对应时间短flip log的功能？
app.get('/api/fliplog', async (req, res) => {
  try {
    const logs = await FlipLog.find().sort({ start_time: -1 }); // 可选排序：按时间倒序
    res.status(200).json(logs);
  } catch (err) {
    console.error("Failed to fetch fliplogs", err);
    res.status(500).json({ error: 'Server error' });
  }
});


//get对应时间段的flip log，pass argument start/end date
app.get('/api/fliplog/range', async (req, res) => {
  const { startDate, endDate } = req.query;

  //这里强制两个都，之后可以改
  if (!startDate || !endDate) {
    return res.status(400).json({ error: "Please provide both startDate and endDate in query parameters." });
  }

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const logs = await FlipLog.find({
      start_time: {
        $gte: start,
        $lte: end
      }
    }).sort({ start_time: -1 }); // 时间倒序

    res.status(200).json(logs);
  } catch (err) {
    console.error("Failed to fetch flip logs in date range", err);
    res.status(500).json({ error: "Server error" });
  }
});




// export the express app we created to make it available to other modules
export default app