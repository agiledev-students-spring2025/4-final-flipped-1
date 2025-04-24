import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Task from '../models/Task.js'
import { body, validationResult } from 'express-validator';

const authenticationRouter = () => {
  const router = express.Router();

  // 注册 API
  router.post('/api/signup', 
    [ body('user_id').isEmail().withMessage('Please input valid email address'),
      body('username').isLength({ min: 1 }).withMessage('Please input a username'),
      body('password').isLength({ min: 3 }).withMessage('Password should be at least 3 digits'),
    ], async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const user_id = req.body.user_id
      const username = req.body.username
      const password = req.body.password

      // console.log(user_id,username,password);

      if (!user_id || !username || !password) {
        return res.status(401).json({success: false, message: `No user id or username or password supplied.`,
        })
      }

      try {
        //测试user_id是否被使用过
        const existingUser = await User.findOne({ user_id });
        if (existingUser) {
          return res.status(409).json({success: false, message: 'This email already exists.',
          });
        }

        //存到数据库里用户名字等
        const user = await new User({ user_id, username, password }).save()

        const defaultTasks = [
          { task_name: 'Read Book',   color: '#dbf7ff', user_id: user.user_id },
          { task_name: 'Study',      color: '#fefbfc', user_id: user.user_id },
          { task_name: 'Meditation', color: '#fff6e0', user_id: user.user_id },
          { task_name: 'Exercise',  color: '#e8f5e9', user_id: user.user_id },
        ];

        try {
          await Task.insertMany(defaultTasks)
        } catch (errDefaultTasks) {
          // 如果默认任务插入失败，不影响注册主流程
          console.error('⚠️ 默认 Task 插入失败（可在登录时补插）：', errDefaultTasks)
        }
        
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
      return res.status(401).json({success: false, message: `No register email or password supplied.`,
      })
    }

    try {
      const user = await User.findOne({ user_id }).exec()

      if (!user) {
        return res.status(401).json({success: false, message: 'User not found.',
        })
      }

      if (!user.validPassword(password)) {
        return res.status(401).json({success: false, message: 'Incorrect password.',
        })
      }

      const token = user.generateJWT()
      res.json({
        success: true,
        message: 'User logged in successfully.',
        token,
        user_id: user.user_id,
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

  //登出 API（只是前端清除 token）
  router.get('/api/logout', (req, res) => {
    res.json({
      success: true,
      message:
        "Nothing to do on the server. Just delete the token on the front-end!",
    })
  })

  //changepassword
  router.post('/api/changepassword', async (req, res) => {
    const { user_id, oldPassword, newPassword } = req.body;
  
    try {
      const user = await User.findOne({ user_id });
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
  
      const isValid = user.validPassword(oldPassword);
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Incorrect old password.' });
      }
  
      user.password = newPassword;
      await user.save();
  
      res.json({ success: true, message: 'Password updated successfully.' });

    } catch (err) {
      console.error("Error changing password", err)
      res.status(500).json({ success: false, message: 'Server error.', error: err })
    }
  });
  

  //change username
  // 修改用户名
  router.post('/api/changeusername', async (req, res) => {
    const { user_id, newUsername } = req.body;

    if (!user_id || !newUsername) {
      return res.status(400).json({ success: false, message: "Missing user_id or newUsername" });
    }

    try {
      const user = await User.findOne({ user_id });

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      user.username = newUsername;
      await user.save();

      return res.json({
        success: true,
        message: "Username updated successfully",
        username: user.username,
      });
    } catch (err) {
      console.error("Error updating username:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });


  return router
}

export default authenticationRouter
