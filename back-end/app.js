// import and instantiate express
import express from 'express'
const app = express()
import cors from 'cors'

// import some useful middleware
import morgan from 'morgan'

// use the morgan middleware to log all incoming http requests
app.use(morgan('dev'))
app.use(cors())

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Mock data for todos
const mockToDos = [
  { date: "2025-02-20", toDo: "Interview with A", time: "14:00", TimeRange: "15min" },
  { date: "2025-02-26", toDo: "Lunch with B", time: "12:30", TimeRange: "45min" },
  { date: "2025-02-20", toDo: "Evening Study", time: "18:00", TimeRange: "2h" },
  { date: "2025-02-23", toDo: "Course A HW", time: "20:00", TimeRange: "1h" },
  { date: "2025-02-23", toDo: "Gym Session", time: "07:30", TimeRange: "1h" },
  { date: "2025-02-26", toDo: "Course B", time: "16:00", TimeRange: "2h 15min" },
  { date: "2025-02-26", toDo: "Course C", time: "19:00", TimeRange: "2h 15min" },
  { date: "2025-02-26", toDo: "Course D", time: "22:00", TimeRange: "2h 15min" },
  { date: "2025-03-25", toDo: "Course B", time: "16:00", TimeRange: "2h 15min" },
  { date: "2025-03-17", toDo: "Course B", time: "16:00", TimeRange: "2h 15min" }
];

// API endpoint to get todos
app.get('/api/todos', (req, res) => {
  res.json(mockToDos);
});

// API endpoint to add a new task
app.post('/api/todos', (req, res) => {
  const { date, toDo, time, TimeRange } = req.body;
  const newToDo = {
    date,
    toDo,
    time,
    TimeRange
  };
  mockToDos.push(newToDo);
  res.json(newToDo);
});

// Mock data for tasks
const mockTasks = [
  { id: 1, name: 'Read Books', color: "#dbf7ff" },
  { id: 2, name: 'Study', color: "#fefbfc" },
  { id: 3, name: 'Haha', color: "#fff6e6" },
  { id: 4, name: 'Exercise', color: "#e8f5e9" }
];

// API endpoint to get tasks
app.get('/api/tasks', (req, res) => {
  res.json(mockTasks);
});

// API endpoint to add a new task
app.post('/api/tasks', (req, res) => {
  const { name, color } = req.body;
  const newTask = {
    id: mockTasks.length > 0 ? Math.max(...mockTasks.map(task => task.id)) + 1 : 1,
    name,
    color
  };
  mockTasks.push(newTask);
  res.json(newTask);
});

// export the express app we created to make it available to other modules
export default app