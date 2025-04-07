import mongoose from 'mongoose'

// const mongoose = require('mongoose')
// const Schema = mongoose.Schema

const FlipLogSchema = new mongoose.Schema({
    task_name: { type: String, required: true, },
    start_time: { type: Date, required: true, },
    end_time: { type: Date, required: true, },
    duration: { type: Number, required: true, }// 单位：秒
})
  
const FlipLog = mongoose.model('FlipLog', FlipLogSchema)
export default FlipLog
  
