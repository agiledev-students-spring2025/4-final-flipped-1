import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


// const mongoose = require('mongoose')
// const Schema = mongoose.Schema

// Define the schema for the ToDo items
const UserSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
});
  
// hash the password before the user is saved
// mongoose provides hooks that allow us to run code before or after specific events
// 加密码
UserSchema.pre('save', function (next) {
  const user = this
  // if the password has not changed, no need to hash it
  if (!user.isModified('password')) return next()
  // otherwise, the password is being modified, so hash it
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err)
    user.password = hash // update the password to the hashed version
    next()
  })
})


// 用户登录的时候验证密码
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

// return a JWT token for the user
UserSchema.methods.generateJWT = function () {
  const today = new Date()
  const exp = new Date(today)
  exp.setDate(today.getDate() + Number(process.env.JWT_EXP_DAYS || 7)) // assuming an environment variable with num days in it

  return jwt.sign(
    {
      id: this._id,
      user_id: this.user_id, 
      username: this.username,
      exp: parseInt(exp.getTime() / 1000),
    },
    process.env.JWT_SECRET
  )
}

// return the user information without sensitive data
UserSchema.methods.toAuthJSON = function () {
  return {
    id: this._id,
    user_id: this.user_id, 
    username: this.username,
    token: this.generateJWT(),
  }
}

const User = mongoose.model('User', UserSchema)
export default User
