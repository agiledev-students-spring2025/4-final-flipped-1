import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema({
    task_name: { type: String, required: true, },
    color: { type: String, required: true, },// 单位：秒
    user_id: { type: String, },
})
  
const Task = mongoose.model('Task', TaskSchema)
export default Task
  
