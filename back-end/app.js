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


mongoose.connect('mongodb://localhost:27017/flip', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB: flip")
})
.catch((err) => {
  console.error("MongoDB connection error:", err)
})


// mongoose.connect(MONGO_URI)
//   .then(() => {
//     console.log("Connected to MongoDB: flip")
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err)
//   })


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
  const newTask = {
    task_id: mockTasks.length > 0 ? Math.max(...mockTasks.map(task => task.task_id)) + 1 : 1,
    name,
    color
  };
  mockTasks.push(newTask);
  res.json(newTask);
});

//API endpoint to delect a task

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

//接口，往FlipLog里面插入新的数据，返回今天task_name的总时长
app.post('/api/fliplog/insert', async (req, res) => {
  const { task_name, start_time, end_time, duration } = req.body;

  try {
    const newLog = new FlipLog({
      task_name,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      duration
    });

    await newLog.save();

    // 拉今天的日期
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // 查今天这个task的总时长
    const todayLogs = await FlipLog.find({
      task_name,
      start_time: { $gte: startOfDay, $lte: endOfDay }
    });

    const todayTotalTime = todayLogs.reduce((sum, log) => sum + log.duration, 0);

    res.status(201).json({
      success: true,
      taskName: task_name,
      duration: duration,
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
app.get('/api/today/:taskName', async (req, res) => {
  const { taskName } = req.params;

  // 拉今天的日期
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  
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