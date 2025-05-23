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

// 健康检查路由
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

//middleware
app.use(morgan('dev'))
// app.use(cors())
app.use(cors({ origin: ['http://localhost:3000', 'http://192.168.88.6:3000', 'http://165.227.97.236:3000'],
  credentials: true
}));
console.log("✅ CORS settings are active");

// app.use(cors({ origin: 'https://localhost:3000', credentials: true, }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000', 'http://192.168.88.6:3000'];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // For preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});



//JWT
import jwtStrategy from './config/jwt-config.js'
passport.use(jwtStrategy)
app.use(passport.initialize())

// routers
import taskRouter from './routes/taskRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import cookieRouter from './routes/cookieRouter.js';
import protectedContentRouter from './routes/protectedContentRoutes.js';
import authenticationRouter from './routes/authenticationRoutes.js';
import fliplogsRouter from './routes/fliplogRoutes.js';

app.use('/tasks', taskRouter());
app.use('/api/todos', todoRoutes);
app.use('/auth', authenticationRouter()) // all requests for /auth/* will be handled by the authenticationRoutes router
app.use('/cookie', cookieRouter()) // all requests for /cookie/* will be handled by the cookieRoutes router
app.use('/protected', protectedContentRouter()) // all requests for /protected/* will be handled by the protectedRoutes router
app.use('/fliplog', fliplogsRouter());


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



  //API




const optionalAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    // console.log("🔍 token raw:", req.headers.authorization);
    // console.log("🔍 user parsed from token:", user);
    // console.log("🔍 error info:", info);
    if (user) {
      req.user = user;
    } else {
      req.user = null; // 未登录也继续
    }
    next();
  })(req, res, next);
};



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

  if (!req.user) {
    return res.status(401).json({ error: 'Must be logged in to record a flip.' });
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


// GET /api/fliplog/total
// 统计当前登录用户的 flip 总时长（秒）
app.get( '/api/fliplog/total',
  optionalAuth,
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    try {
      const userId = req.user.user_id;

      const result = await FlipLog.aggregate([
        { $match: { user_id: userId } },
        { $group: { _id: null, total: { $sum: '$duration' } } }
      ]);
      const total = (result[0] && result[0].total) || 0;
      res.json({ totalDuration: total });
  } catch (err) {
      console.error('Fail to get total flip time', err);
    res.status(500).json({ error: 'Server error' });
    }
  }
);





// export the express app we created to make it available to other modules
export default app