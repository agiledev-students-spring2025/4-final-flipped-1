import mongoose from 'mongoose'

// const mongoose = require('mongoose')
// const Schema = mongoose.Schema

// Define the schema for the ToDo items
const UserSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: Number, required: true },
});
  
const User = mongoose.model('User', userSchema)
export default User