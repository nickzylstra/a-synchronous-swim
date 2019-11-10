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

module.exports.router = ({url, method}, res, next = ()=>{}) => {
  console.log('Serving request type ' + method + ' for url ' + url);
  // TODO only works with files at root aka /
  // const dir = path.dirname(url);
  // const filename = path.basename(url);
  // const localPath = ? : ;
  // console.log(`dir '${dir}' and filename '${filename}'`);
  // url = path.basename(url) || '/';
  // console.log(url);
  // console.log(path.join('/', module.exports.backgroundImageFile));
  if (url === '/' || fs.existsSync(url.slice(1))) {
    if (url === '/') {
      if (method === 'OPTIONS') {
        res.writeHead(200, headers);
        res.end();
      }

      if (method === "GET") {
        res.writeHead(200, headers);
        // move into conditional logic on 26
        const moves = ['left', 'right', 'up', 'down'];
        const randMove = moves[Math.floor(Math.random() * moves.length)];

        let move = messages.dequeue();
        move = move ? move : randMove;

        res.write(move);
        res.end();
      }
    } else if (url === path.join('/', module.exports.backgroundImageFile)) {
      console.log('looking for background');
      if (method === "GET") {
        res.writeHead(200, headers);
        const image = fs.readFileSync(path.join('.', url));
        console.log('background served')
        res.write(image);
        res.end();
      }

      if (method === "POST") {
        res.writeHead(201, headers);
        res.end();
      }
    } else {
      res.writeHead(500, headers);
      console.log(`server error for url "${url}"`);
      res.end();
    }
  } else {
    res.writeHead(404, headers);
    console.log(`url "${url}" not found`);
    res.end();
  }

  next(); // invoke next() at the end of a request to help with testing!
};
