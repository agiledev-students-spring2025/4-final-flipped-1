import mongoose from 'mongoose'

// const mongoose = require('mongoose')
// const Schema = mongoose.Schema

// Define the schema for the ToDo items
const toDoSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    date: { type: String, required: true }, // e.g. "2025-04-20"
    toDo: { type: String, required: true },
    startTime: { type: String, required: true }, // e.g. "09:00"
    endTime: { type: String, required: true },   // e.g. "10:00"
  });  

  
const Todo = mongoose.model('Todo', toDoSchema)
export default Todo