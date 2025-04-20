import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Task from './models/Task.js'
import FlipLog from './models/FlipLog.js'
import User from './models/User.js'
import Todo from './models/ToDo.js';

dotenv.config()


mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB: flip")

    // const flipSeedData = [
    //   { task_name: "Study", start_time: new Date("2025-04-03T08:00:00Z"), end_time: new Date("2025-04-06T08:30:00Z"), duration: 1800 },
    //   { task_name: "Read Book", start_time: new Date("2025-04-03T10:00:00Z"), end_time: new Date("2025-04-06T10:45:00Z"), duration: 2700 },
    //   { task_name: "Exercise", start_time: new Date("2025-04-05T12:00:00Z"), end_time: new Date("2025-04-06T12:30:00Z"), duration: 1800 },
    //   { task_name: "Study", start_time: new Date("2025-04-06T12:00:00Z"), end_time: new Date("2025-04-07T12:30:00Z"), duration: 1800 }
    // ];

    // // await FlipLog.deleteMany(); //删除旧数据
    // await FlipLog.insertMany(flipSeedData);
    // console.log("Flip seed data inserted!");

    // const taskSeedData = [
    //   { task_name: "Read Book", color: "#dbf7ff", user_id: "all" },
    //   { task_name: "Study", color: "#fefbfc", user_id: "all" },
    //   { task_name: "Meditation", color: "#fff6e0", user_id: "all" },
    //   { task_name: "Exercise", color: "#e8f5e9", user_id: "all" }
    // ];

    // await Task.insertMany(taskSeedData);
    // console.log("Task seed inserted!");

    const userSeedData = [
      { user_id: "test@gmail.com", username: "Const", password: "12345678" },
    ];

    await User.insertMany(userSeedData);
    console.log("Task seed inserted!");

    const todoSeedData = [
      { date: "2025-02-20", toDo: "Interview with A", startTime: "14:00", endTime: "14:15", user_id: "seed_user" },
      { date: "2025-02-26", toDo: "Lunch with B", startTime: "12:30", endTime: "13:15", user_id: "seed_user" },
      { date: "2025-02-20", toDo: "Evening Study", startTime: "18:00", endTime: "20:00", user_id: "seed_user" },
      { date: "2025-02-23", toDo: "Course A HW", startTime: "20:00", endTime: "21:00", user_id: "seed_user" },
      { date: "2025-02-23", toDo: "Gym Session", startTime: "07:30", endTime: "08:30", user_id: "seed_user" },
      { date: "2025-02-26", toDo: "Course B", startTime: "16:00", endTime: "18:15", user_id: "seed_user" },
      { date: "2025-02-26", toDo: "Course C", startTime: "19:00", endTime: "21:15", user_id: "seed_user" },
      { date: "2025-02-26", toDo: "Course D", startTime: "22:00", endTime: "00:15", user_id: "seed_user" },
      { date: "2025-03-25", toDo: "Course B", startTime: "16:00", endTime: "18:15", user_id: "seed_user" },
      { date: "2025-03-17", toDo: "Course B", startTime: "16:00", endTime: "18:15", user_id: "seed_user" }
    ];

    await Todo.deleteMany();
    await Todo.insertMany(todoSeedData);
    console.log("Todo seed inserted!");

    process.exit();
  })
  .catch(err => {
    console.error("Seeding failed:", err)
    process.exit(1)
  })
