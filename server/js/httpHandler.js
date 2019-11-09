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

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  // TODO only works with files at root aka /
  const url = path.basename(req.url) || '/';
  // console.log(url);
  if (fs.existsSync(url)) {
    if (url === '/') {
      res.writeHead(200, headers);

      if (req.method === "GET") {
        // move into conditional logic on 26
        const moves = ['left', 'right', 'up', 'down'];
        const randMove = moves[Math.floor(Math.random() * moves.length)];

        let move = messages.dequeue();
        move = move ? move : randMove;

        res.write(move);
      }

      res.end();
    } else if (url === 'background.jpg') {
      // TODO dynamically grab backgrountimagefile

      if (req.method === "GET") {
        res.writeHead(200, headers);
        const image = fs.readFileSync(path.join('.', url));
        res.write(image);
      }

      if (req.method === "POST") {
        res.writeHead(201, headers);

      }

      res.end();
    }
  } else {
    res.writeHead(404, headers);
    console.log(`url ${url} not found`);
    res.end();
  }

  next(); // invoke next() at the end of a request to help with testing!
};
