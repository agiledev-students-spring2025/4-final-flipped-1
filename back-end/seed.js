import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Task from './models/Task.js'
import FlipLog from './models/FlipLog.js'

dotenv.config()


mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB: flip")

    const flipSeedData = [
      { task_name: "Study", start_time: new Date("2025-04-03T08:00:00Z"), end_time: new Date("2025-04-06T08:30:00Z"), duration: 1800 },
      { task_name: "Read Book", start_time: new Date("2025-04-03T10:00:00Z"), end_time: new Date("2025-04-06T10:45:00Z"), duration: 2700 },
      { task_name: "Exercise", start_time: new Date("2025-04-05T12:00:00Z"), end_time: new Date("2025-04-06T12:30:00Z"), duration: 1800 },
      { task_name: "Study", start_time: new Date("2025-04-06T12:00:00Z"), end_time: new Date("2025-04-07T12:30:00Z"), duration: 1800 }
    ];

    // await FlipLog.deleteMany(); //删除旧数据
    await FlipLog.insertMany(flipSeedData);
    console.log("Flip seed data inserted!");

    const taskSeedData = [
      { task_name: "Read Book", color: "#dbf7ff", user_id: "all" },
      { task_name: "Study", color: "#fefbfc", user_id: "all" },
      { task_name: "Meditation", color: "#fff6e0", user_id: "all" },
      { task_name: "Exercise", color: "#e8f5e9", user_id: "all" }
    ];

    await Task.insertMany(taskSeedData);
    console.log("Task seed inserted!");

    process.exit();
  })
  .catch(err => {
    console.error("Seeding failed:", err)
    process.exit(1)
  })
