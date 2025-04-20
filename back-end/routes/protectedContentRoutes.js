import express from 'express';
import passport from 'passport';

const protectedContentRoutes = () => {
  const router = express.Router();

  router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
      res.json({
        success: true,
        user: {
          id: req.user._id,
          user_id: req.user.user_id,
          username: req.user.username,
        },
        message:
          'Congratulations: you have accessed this route because you have a valid JWT token!',
      });
      next();
    }
  );

  return router;
};

export default protectedContentRoutes;
