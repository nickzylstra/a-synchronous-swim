const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const messages = require('./messageQueue');

// let backgroundImageFilePath = path.join('.', 'background.jpg');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

// WHAT IS THIS???
let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = ({url, method, addListener}, res, next = ()=>{}) => {
  console.log('Serving request type ' + method + ' for url ' + url);
  // const dir = path.dirname(url);
  // const filename = path.basename(url);
  // console.log(`dir '${dir}' and filename '${filename}'`);
  // console.log(url);
  // console.log(path.join('/', module.exports.backgroundImageFile));
  if (url === '/') {
    if (method === 'OPTIONS') {
      res.writeHead(200, headers);
      res.end();
    }

    if (method === "GET") {
      res.writeHead(200, headers);

      let move = messages.dequeue();
      if (!move) {
        const moves = ['left', 'right', 'up', 'down'];
        move = moves[Math.floor(Math.random() * moves.length)];
      }
      res.write(move);

      res.end();
    }

  } else if (url === path.join('/', module.exports.backgroundImageFile)) {
    if (method === "GET") {
      if (fs.existsSync(url.slice(1))) {
        res.writeHead(200, headers);
        // can this be done async?
        const image = fs.readFileSync(path.join('.', url));
        res.write(image);
        res.end();
      } else {
        res.writeHead(404, headers);
        console.log(`url "${url}" not found`);
        res.end();
      }
    }

    if (method === "POST") {
      res.writeHead(201, headers);

      let imageBuffer = new Buffer.alloc(0);
      on('data', (data) => {
        imageBuffer = data;
      });

      // can this be done async?
      const fd = fs.openSync(module.exports.backgroundImageFile, 'w+');
      fs.writeSync(fd, imageBuffer);

      res.end();
    }

  } else {
    res.writeHead(404, headers);
    console.log(`url "${url}" not found`);
    res.end();
  }

  next(); // invoke next() at the end of a request to help with testing!
};
