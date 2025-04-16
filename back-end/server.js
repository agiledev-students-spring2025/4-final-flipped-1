#!/usr/bin/env node

// import the express app
import https from 'https';
import fs from 'fs';
import server from './app.js'

// which port to listen for HTTP(S) requests
const port = 3001
// const port = process.env.PORT || 3001;
const options = {
  key: fs.readFileSync('./localhost-key.pem'),  // 使用相对路径
  cert: fs.readFileSync('./localhost.pem'),
};


const httpsServer = https.createServer(options, server);

// call a function to start listening to the port
// const listener = server.listen(port, function () {
//   console.log(`Server running on port: ${port}`)
// })
const listener = httpsServer.listen(port, '0.0.0.0', () => {
  console.log('HTTPS Server running on https://localhost:${port}');
  console.log('also able to listening');
});


// a function to stop listening to the port
const close = () => {
  listener.close()
}

// export the close function
export { close }
