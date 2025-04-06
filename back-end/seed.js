import mongoose from 'mongoose'
import dotenv from 'dotenv'
import FlipLog from './models/FlipLog.js'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI

// 1. 连接数据库
mongoose.connect('mongodb://admin:secret@localhost:27017/flip?authSource=admin')
  .then(async () => {
    console.log("Connected to MongoDB: flip")

    // 3. 添加测试数据
    const seedData = [
      {
        task_name: "Study",
        start_time: new Date("2025-04-06T08:00:00Z"),
        end_time: new Date("2025-04-06T08:30:00Z"),
        duration: 1800
      },
      {
        task_name: "Read Books",
        start_time: new Date("2025-04-06T10:00:00Z"),
        end_time: new Date("2025-04-06T10:45:00Z"),
        duration: 2700
      },
      {
        task_name: "Exercise",
        start_time: new Date("2025-04-06T12:00:00Z"),
        end_time: new Date("2025-04-06T12:30:00Z"),
        duration: 1800
      },
      {
        task_name: "Study",
        start_time: new Date("2025-04-07T12:00:00Z"),
        end_time: new Date("2025-04-07T12:30:00Z"),
        duration: 1800
      }
    ]

    await FlipLog.insertMany(seedData)
    console.log("Seed data inserted!")

    process.exit() // 结束程序
  })
  .catch(err => {
    console.error("Seeding failed:", err)
    process.exit(1)
  })
