/*
COMP 2406 (c) Justin Tam

Testing: Use browser to view pages at http://localhost:3000/assignment1.html
Cntl+C in console to stop server.

*/

//hard coded partial song lyrics to serve client
let peacefulEasyFeeling = []
let sisterGoldenHair = []
let brownEyedGirl = []

const songs = {
  "Peaceful Easy Feeling": peacefulEasyFeeling,
  "Sister Golden Hair": sisterGoldenHair,
  "Brown Eyed Girl": brownEyedGirl
};

//Server Code
const http = require("http"); //need to http
const fs = require("fs"); //need to read static files
const url = require("url"); //to parse url strings

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

const get_mime = function(filename) {
  //Use file extension to determine the correct response MIME type
  for (let ext in MIME_TYPES) {
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
       return MIME_TYPES[ext]
    }
  }
  return MIME_TYPES["txt"]
}


fs.readFile('html/Peaceful Easy Feeling.txt', function(err, data) {
  if(err) throw err
  //save each line
  let temp_line = data.toString().split("\n")

  for (let i = 0;i<temp_line.length;i++){
    //seperate chords and lyrics
    temp_line [i] = temp_line[i].replace(/\[/g," [")
    temp_line [i]= temp_line[i].replace(/]/g,"] ");
    let temp_string = temp_line[i].split (" ")

    //create 2d array
    peacefulEasyFeeling[i] = []

    //save each word as an element
    for (let j = 0;j<temp_string.length;j++){
      peacefulEasyFeeling[i][j] = ({word : temp_string[j] , y: 50 * (i+1)})
    }
  }

})

fs.readFile('html/Sister Golden Hair.txt', function(err, data) {
  if(err) throw err
  //save each line
  let temp_line = data.toString().split("\n")
  for (let i = 0;i<temp_line.length;i++){
    //seperate lyrics
    let temp_string = temp_line[i].split (" ")

    //create 2d array
    sisterGoldenHair[i] = []
    
    //save each word as an element
    for (let j = 0;j<temp_string.length;j++){
      sisterGoldenHair[i][j] = ({word : temp_string[j], y: 50 * (i+1)})
    }
  }

})

fs.readFile('html/Brown Eyed Girl.txt', function(err, data) {
  if(err) throw err
  //save each line
  let temp_line = data.toString().split("\n")

  for (let i = 0;i<temp_line.length;i++){
    //seperate chords and lyrics
    temp_line [i] = temp_line[i].replace(/\[/g," [")
    temp_line [i]= temp_line[i].replace(/]/g,"] ");
    let temp_string = temp_line[i].split (" ")

    //create 2d array
    brownEyedGirl[i] = []

    //save each word as an element
    for (let j = 0;j<temp_string.length;j++){
      brownEyedGirl[i][j] = ({word : temp_string[j] , y: 50 * (i+1)})
    }
  }

})



http.createServer(function(request, response) {
    var urlObj = url.parse(request.url, true, false)
    console.log("\n============================")
    console.log("PATHNAME: " + urlObj.pathname)
    console.log("REQUEST: " + ROOT_DIR + urlObj.pathname)
    console.log("METHOD: " + request.method)

    var receivedData = ""
    //Event handlers to collect the message data
    request.on("data", function(chunk) {
      receivedData += chunk;
    })

    //Event handler for the end of the message
    request.on("end", function() {
      console.log("received data: ", receivedData)
      console.log("type: ", typeof receivedData)

      //if it is a POST request then echo back the data.
      if (request.method == "POST") {
        //Handle POST requests
        var dataObj = JSON.parse(receivedData)
        console.log("received data object: ", dataObj)
        console.log("type: ", typeof dataObj)
        console.log("USER REQUEST: " + dataObj.text)

        //create return object
        var returnObj = {}
        //go through array of song
        for (title in songs) {
          if (title === dataObj.text) { //if song exists save the song array
            returnObj.wordArray = songs[title];
          }
        }
        //--------------------------
        //object to return to client
        response.writeHead(200, { "Content-Type": MIME_TYPES["txt"] })
        response.end(JSON.stringify(returnObj)) //send just the JSON object as plain text
      }

      if (request.method == "GET") {
        //Handle GET requests
        //Treat GET requests as request for static file
        var filePath = ROOT_DIR + urlObj.pathname
        if (urlObj.pathname === "/") filePath = ROOT_DIR + "/index.html"

        fs.readFile(filePath, function(err, data) {
          if (err) {
            //report error to console
            console.log("ERROR: " + JSON.stringify(err))
            //respond with not found 404 to client
            response.writeHead(404)
            response.end(JSON.stringify(err))
            return
          }
          //respond with file contents
          response.writeHead(200, { "Content-Type": get_mime(filePath) })
          response.end(data)
        })
      }
    })
  }).listen(3000)
console.log("Server Running at PORT 3000  CNTL-C to quit")
console.log("To Test:")
console.log("http://localhost:3000/assignment1.html")
