import express from 'express';

const cookieRouter = () => {
  const router = express.Router();

  // 设置 cookie
  router.get('/set', (req, res) => {
    res
      .cookie('foo', 'bar') // 设置名为 foo，值为 bar 的 cookie
      .send({
        success: true,
        message: 'Sent a cookie to the browser... hopefully it saved it.',
      });
  });

  // 读取 cookie
  router.get('/get', (req, res) => {
    const numCookies = Object.keys(req.cookies).length;

    console.log(`Incoming cookie data: ${JSON.stringify(req.cookies, null, 0)}`);
    res.send({
      success: numCookies > 0,
      message: numCookies
        ? 'Thanks for sending cookies to the server :)'
        : 'No cookies sent to server :(',
      cookieData: req.cookies,
    });
  });

  return router;
};

export default cookieRouter;
