import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

// import and instantiate express
import express from 'express'
const app = express()
import cors from 'cors'

// import some useful middleware
import morgan from 'morgan'

// import database table
import FlipLog from './models/FlipLog.js';

// use the morgan middleware to log all incoming http requests
app.use(morgan('dev'))
app.use(cors())

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB: flip")
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
  })

// Mock data for todos
const mockToDos = [
  { id: 1, date: "2025-02-20", toDo: "Interview with A", time: "14:00", TimeRange: "15min" },
  { id: 2, date: "2025-02-26", toDo: "Lunch with B", time: "12:30", TimeRange: "45min" },
  { id: 3, date: "2025-02-26", toDo: "Lunch with B", time: "12:30", TimeRange: "45min" },
  { id: 4, date: "2025-02-20", toDo: "Evening Study", time: "18:00", TimeRange: "2h" },
  { id: 5, date: "2025-02-23", toDo: "Course A HW", time: "20:00", TimeRange: "1h" },
  { id: 6, date: "2025-02-23", toDo: "Gym Session", time: "07:30", TimeRange: "1h" },
  { id: 7, date: "2025-02-26", toDo: "Course B", time: "16:00", TimeRange: "2h 15min" },
  { id: 8, date: "2025-02-26", toDo: "Course C", time: "19:00", TimeRange: "2h 15min" },
  { id: 9, date: "2025-02-26", toDo: "Course D", time: "22:00", TimeRange: "2h 15min" },
  { id: 10, date: "2025-03-25", toDo: "Course B", time: "16:00", TimeRange: "2h 15min" },
  { id: 11, date: "2025-03-17", toDo: "Course B", time: "16:00", TimeRange: "2h 15min" }
];

// API endpoint to get todos
app.get('/api/todos', (req, res) => {
  res.json(mockToDos);
});

// API endpoint to add a new task
app.post('/api/todos', (req, res) => {
  const { date, toDo, time, TimeRange } = req.body;
  const newId = mockToDos.length ? Math.max(...mockToDos.map(todo => todo.id)) + 1 : 1;
  const newToDo = {
    id: newId,
    date,
    toDo,
    time,
    TimeRange
  };
  mockToDos.push(newToDo);
  res.json(newToDo);
});

app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockToDos.findIndex(todo => todo.id === id);

  if (index !== -1) {
    const deleted = mockToDos.splice(index, 1);
    res.json({ message: 'Todo deleted', deleted: deleted[0] });
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});


// Mock data for tasks
const mockTasks = [
  { task_id: 1, name: 'Read Books', color: "#dbf7ff" },
  { task_id: 2, name: 'Study', color: "#fefbfc" },
  { task_id: 3, name: 'Haha', color: "#fff6e6" },
  { task_id: 4, name: 'Exercise', color: "#e8f5e9" }
];

const flipLogs = [
  {
    task_name: "Study",
    date: "2025.3.27",
    start_time: "14:00:00",
    end_time: "14:11:00",
    duration: 660
  },
  {
    task_name: "Study",
    date: "2025.3.26",
    start_time: "19:51:00",
    end_time: "06:56:46",
    duration: 36346
  },
  {
    task_name: "Study",
    date: "2025.3.24",
    start_time: "20:45:00",
    end_time: "21:26:05",
    duration: 2465
  },
  {
    task_name: "Read Books",
    date: "2025.3.21",
    start_time: "11:09:00",
    end_time: "13:11:00",
    duration: 7320
  },
  {
    task_name: "Read Books",
    date: "2025.3.20",
    start_time: "01:00:00",
    end_time: "01:00:22",
    duration: 22
  },
  {
    task_name: "Study",
    date: "2025.3.18",
    start_time: "21:19:00",
    end_time: "22:49:00",
    duration: 5400
  },
  {
    task_name: "Haha",
    date: "2025.3.16",
    start_time: "21:22:00",
    end_time: "23:59:00",
    duration: 9540
  },
  {
    task_name: "Exercise",
    date: "2025.3.13",
    start_time: "19:55:00",
    end_time: "20:32:43",
    duration: 2203
  },
  {
    task_name: "Study",
    date: "2025.2.24",
    start_time: "11:35:00",
    end_time: "11:35:07",
    duration: 7
  }
];


// API endpoint to get tasks
app.get('/api/tasks', (req, res) => {
  res.json(mockTasks);
});

// API endpoint to add a new task
app.post('/api/tasks', (req, res) => {
  const { name, color } = req.body;
  
  // 找到当前最大的 task_id
  const maxId = mockTasks.reduce((max, task) => {
    return task.task_id > max ? task.task_id : max;
  }, 0);

  const newTask = {
    task_id: maxId + 1,
    name,
    color
  };

  mockTasks.push(newTask);
  res.status(201).json(newTask);
});

// Temporary in-memory object to store time (since tasks don't have time tracking yet)
const taskTimes = {}

app.post('/api/tasks/:taskId/time', (req, res) => {
  const { taskId } = req.params;
  const { timeSpent } = req.body;

  const task = mockTasks.find(t => t.task_id === Number(taskId));
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Store time in taskTimes map
  taskTimes[taskId] = (taskTimes[taskId] || 0) + timeSpent;

  res.json({
    success: true,
    task: {
      ...task,
      totalTime: taskTimes[taskId]
    }
  });
});

// API endpoint to update an existing task
app.put('/api/tasks/:taskId', (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const { name, color } = req.body;
  
  const taskIndex = mockTasks.findIndex(task => task.task_id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // Update the task
  mockTasks[taskIndex] = {
    ...mockTasks[taskIndex],
    name,
    color
  };

  res.json(mockTasks[taskIndex]);
});

// API endpoint to delete a task
app.post('/api/tasks/:taskId/delete', (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const taskIndex = mockTasks.findIndex(task => task.task_id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // Remove the task from the array
  mockTasks.splice(taskIndex, 1);

  res.status(200).json({ message: 'Task deleted successfully' });
});


// app.get today total time//翻转flipbefore的时候发出的请求
 

//作为fakedata flip before翻转后
// app.post('/api/fliplog', async (req, res) => {
  // 给flipbefore用
  // 插数据+返回total today time
  //+log
  //返回本次的name+duration
// }

app.post('/api/fliplog', (req, res) => {
  const { task_name, date, start_time, end_time, duration } = req.body;

  // flip log
  const newLog = { task_name, date, start_time, end_time, duration };
  flipLogs.push(newLog);

  // daily duration
  const todayLogs = flipLogs.filter(
    log => log.task_name === task_name && log.date === date
  );

  const todayTotalTime = todayLogs.reduce((sum, log) => sum + log.duration, 0);

  // return back to front end?
  res.status(201).json({
    success: true,
    log: newLog,
    todayTotalTime: todayTotalTime
  });
});


app.get('/api/fliplog', (req, res) => {
  res.json(flipLogs);
});







//API real endpoint for insert new log to fliplog table
// 接口，往FlipLog里面插入新的数据，返回该task name, task_name的今日总时长（单位秒）
app.post('/api/fliplog/insert', async (req, res) => {
  const { task_name, start_time, end_time, duration } = req.body;
  const roundDuration = Math.floor(duration)

  try {
    const newLog = new FlipLog({
      task_name,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      duration: roundDuration
    });

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

    //返回数据
    res.status(201).json({
      success: true,
      taskName: task_name,
      duration: roundDuration,
      log: newLog,
      todayTotalTime,
    });

  } catch (err) {
    console.error("Fail to insert flip log into FlipLog Collection", err);
    res.status(500).json({ error: "server error" });
  }
});


//get today total flip time
//return：task name, today Total Time
//flip before page显示时调用
app.get('/api/today/:taskName', async (req, res) => {
  const { taskName } = req.params;

  // 拉今天的日期
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  
  try {
    const todayLogs = await FlipLog.find({
      task_name: taskName,
      start_time: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    const todayTotalTime = todayLogs.reduce((sum, log) => sum + log.duration, 0);

    res.json({
      taskName,
      todayTotalTime
    });
  } catch (err) {
    console.error("Fail to get today total flip time", err);
    res.status(500).json({ error: 'server error' });
  }
});







// export the express app we created to make it available to other modules
export default app