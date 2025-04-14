import mongoose from 'mongoose'

// const mongoose = require('mongoose')
// const Schema = mongoose.Schema

// Define the schema for the ToDo items
const toDoSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    to_do_name: { type: String, required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, },
    time_range: { type: Number, },
});

  
const Todo = mongoose.model('Todo', toDoSchema)
export default Todo