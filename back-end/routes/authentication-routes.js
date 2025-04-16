import express from 'express'
import User from '../models/User.js'

const authenticationRouter = () => {
  const router = express.Router()

  // 注册 API
  router.post('/api/signup', async (req, res) => {
    const user_id = req.body.user_id
    const username = req.body.username
    const password = req.body.password

    if (!user_id || !username || !password) {
      return res.status(401).json({
        success: false,
        message: `No user id or username or password supplied.`,
      })
    }

    try {
      const existingUser = await User.findOne({ user_id });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'This email already exists.',
        });
      }

      //存到数据库里
      const user = await new User({ user_id, username, password }).save()
      const token = user.generateJWT()
      res.json({
        success: true,
        message: 'User saved successfully.',
        token,
        user_id: user.user_id,
        username: user.username,
      })
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error saving user to database.',
        error: err,
      })
    }
  })

  // 登录 API
  router.post('/api/login', async (req, res) => {
    const { user_id, password } = req.body

    if (!user_id || !password) {
      return res.status(401).json({
        success: false,
        message: `No register email or password supplied.`,
      })
    }

    try {
      const user = await User.findOne({ user_id }).exec()

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found.',
        })
      }

      if (!user.validPassword(password)) {
        return res.status(401).json({
          success: false,
          message: 'Incorrect password.',
        })
      }

      const token = user.generateJWT()
      res.json({
        success: true,
        message: 'User logged in successfully.',
        token,
        username: user.username,
      })
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error looking up user in database.',
        error: err,
      })
    }
  })

  // ✅ 登出 API（只是前端清除 token）
  router.get('/logout', (req, res) => {
    res.json({
      success: true,
      message:
        "Nothing to do on the server. Just delete the token on the front-end!",
    })
  })

  return router
}

export default authenticationRouter
