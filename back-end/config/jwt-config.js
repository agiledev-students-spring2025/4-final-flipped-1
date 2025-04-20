import mongoose from 'mongoose';
import User from '../models/User.js';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

const ObjectId = mongoose.Types.ObjectId;

// JWT 策略配置项
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'), // 从请求头中提取 token
  secretOrKey: process.env.JWT_SECRET, // 用于验证签名
};

// 验证 JWT Token 的函数
const jwtVerifyToken = async (jwt_payload, done) => {
  console.log('JWT payload received:', jwt_payload);

  // 检查 token 是否过期
  const expirationDate = new Date(jwt_payload.exp * 1000); // 秒 → 毫秒
  if (expirationDate < new Date()) {
    return done(null, false, { message: 'JWT token has expired.' });
  }

  try {
    // 查找用户
    const userId = new ObjectId(jwt_payload.id);
    const user = await User.findById(userId).exec();

    if (user) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'User not found.' });
    }
  } catch (err) {
    console.error('Error verifying token:', err);
    return done(err, false);
  }
};

// 导出 JWT 策略供 passport 使用
const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerifyToken);
export default jwtStrategy;
