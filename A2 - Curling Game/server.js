/*
(c) 2018 Justin Tam

//collaboration with Socket IO
//=============================

install modules:
You must first install npm socket.io module
>npm install socket.io

To run:
>node server.js

To test:
Open several browsers at http://localhost:3000/canvasWithTimer.html
*/

//Cntl+C to stop server
const app = require('http').createServer(handler)
const io = require('socket.io')(app) //wrap server app in socket io capability
const fs = require("fs") //need to read static files
const url = require("url") //to parse url strings
const PORT = process.env.PORT || 3000

app.listen(PORT) //start server listening on PORT

//server maintained location of moving box
let movingBoxLocation = {
  x: 100,
  y: 100
} //will be over-written by clients

const ROOT_DIR = "html"; //dir to serve static files from

const MIME_TYPES = {
  css: "text/css",
  gif: "image/gif",
  htm: "text/html",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "application/javascript",
  json: "application/json",
  png: "image/png",
  svg: "image/svg+xml",
  txt: "text/plain"
}

function get_mime(filename) {
  for (let ext in MIME_TYPES) {
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return MIME_TYPES[ext]
    }
  }
  return MIME_TYPES["txt"]
}

io.on('connection', function(socket) {
  socket.on('stoneData', function(data) {
    console.log('RECEIVED STONE DATA: ' + data)
    //to broadcast message to everyone including sender:
    io.emit('stoneData', data) //broadcast to everyone including sender
  })

  socket.on('playerData', function(data) {
    console.log('RECEIVED PLAYER DATA: ' + data)
    //to broadcast message to everyone including sender:
    io.emit('playerData', data) //broadcast to everyone including sender
  })

})

function handler(request, response) {
  let urlObj = url.parse(request.url, true, false)
  console.log("\n============================")
  console.log("PATHNAME: " + urlObj.pathname)
  console.log("REQUEST: " + ROOT_DIR + urlObj.pathname)
  console.log("METHOD: " + request.method)

  let receivedData = ""

  //attached event handlers to collect the message data
  request.on("data", function(chunk) {
    receivedData += chunk;
  })

  //event handler for the end of the message
  request.on("end", function() {
    console.log("REQUEST END: ")
    console.log("received data: ", receivedData)
    console.log("type: ", typeof receivedData)

    if (request.method == "POST") {
      /*
      NOTHING LEFT TO DO HERE
      */
    }

    if (request.method == "GET") {
      //handle GET requests as static file requests
      fs.readFile(ROOT_DIR + urlObj.pathname, function(err, data) {
        if (err) {
          //report error to console
          console.log("ERROR: " + JSON.stringify(err))
          //respond with not found 404 to client
          response.writeHead(404)
          response.end(JSON.stringify(err))
          return
        }
        response.writeHead(200, {
          "Content-Type": get_mime(urlObj.pathname)
        })
        response.end(data)
      })
    }
  })
}

console.log("Server Running at PORT 3000 CNTL-C to quit")
console.log("To Test")
console.log("Open several browsers at http://localhost:3000/assignment3.html")
