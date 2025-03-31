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