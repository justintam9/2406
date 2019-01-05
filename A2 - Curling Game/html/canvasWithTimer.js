/*
(c) 2018 Justin Tam
*/


let timer //used to control the free moving word
let stoneMover // timer for moving stone

let deltaX, deltaY //location where mouse is pressed
let finalX, finalY //location where mouse is released

let uniqueid //broswer id
let hasid = false //stone control

const canvas = document.getElementById("canvas1") //big view canvas
const canvas2 = document.getElementById("canvas2") //long view canvas
const fontPointSize = 18 //point size for word text
const wordHeight = 20 //estimated height of a string in the editor
const editorFont = "Arial" //font for your editor

//stones (x,y,colour,vx,vy,power,moving,id,playerid)
let stone1 = {x: canvas2.width/7, y: canvas2.height-100, colour: "white",vx:0,vy:0,power:0, moving: false, id:0,playerid: null}
let stone2 = {x: canvas2.width/7 * 2, y: canvas2.height-100,colour: "white",vx:0,vy:0,power:0,moving: false,id:1,playerid: null}
let stone3 = {x: canvas2.width/7 * 3, y: canvas2.height-100,colour: "white",vx:0,vy:0,power:0,moving: false,id:2,playerid: null}
let stone4 = {x: canvas2.width/7 * 4, y: canvas2.height-100,colour: "white",vx:0,vy:0,power:0,moving: false,id:3,playerid: null}
let stone5 = {x: canvas2.width/7 * 5, y: canvas2.height-100,colour: "white",vx:0,vy:0,power:0,moving: false,id:4,playerid: null}
let stone6 = {x: canvas2.width/7 * 6, y: canvas2.height-100,colour: "white",vx:0,vy:0,power:0,moving: false,id:5,playerid: null}

//arrays to organize the stones
let stones = [stone1,stone2,stone3,stone4,stone5,stone6]
let p1stones = [stone1,stone2,stone3]
let p2stones = [stone4,stone5,stone6]
let collisionStones =[]
let pNames = ["",""]
var id = -1



var vx = 1.0; //default velocity x
var vy = 1.0; //default velocity y
const friction = 0.99; //friction value


function drawCanvas() {
  const context = canvas.getContext("2d")
  const context2 = canvas2.getContext("2d")

  //erase both canvas
  context.fillStyle = "white"
  context.fillRect(0, 0, canvas.width, canvas.height)

  context2.fillStyle = "white"
  context2.fillRect(0, 0, canvas.width, canvas.height)

  context.font = "" + fontPointSize + "pt " + editorFont
  context2.font = "" + fontPointSize + "pt " + editorFont

  //text area to show players in control
  let textDiv = document.getElementById("text-area")
  textDiv.innerHTML = ''
  textDiv.innerHTML = textDiv.innerHTML = textDiv.innerHTML + `<p> Player 1 (${stones[0].colour}) :  ${pNames[0]} </p>` + `<p> Player 2 (${stones[3].colour}) :  ${pNames[1]} </p>`

  //big view circles
  drawCircle (2.5,"blue")
  drawCircle (3.3,"white")
  drawCircle (4.8,"red")
  drawCircle (8,"white")

  //small view circles
  drawSmallCircle (8,"blue")
  drawSmallCircle (11,"white")
  drawSmallCircle (16,"red")
  drawSmallCircle (30,"white")

  //update stone locations
  for (let i = 0; i < stones.length; i++){
    drawSmallStone (stones[i].colour,stones[i].x,stones[i].y) //small view stones
    if (stones[i].y <250){ //big view stones
      drawStone (stones[i].colour,stones[i].x,stones[i].y)
    }

  }

  //bigger target circles
  function drawCircle (r,colour){
    context.fillStyle = colour
    context.strokeStyle = colour
    context.beginPath();
    context.arc(
      canvas.width / 2, //x co-ord
      canvas.height / 2, //y co-ord
      canvas.height /r, //radius
      0, //start angle
      2 * Math.PI //end angle
    )
    context.fill()
    context.stroke()
  }

  //small target circles
  function drawSmallCircle (r,colour){
    context2.fillStyle = colour
    context2.strokeStyle = colour
    context2.beginPath();
    context2.arc(
      canvas2.width / 2, //x co-ord
      canvas2.height / 6, //y co-ord
      canvas2.height /r, //radius
      0, //start angle
      2 * Math.PI //end angle
    )
    context2.fill()
    context2.stroke()
  }

  //bigger stones
  function drawStone (colour,x,y){
    //set outside circle for aesthetic
    context.fillStyle = "grey"
    context.strokeStyle = "grey"
    context.beginPath();
    x = x*3
    y= y*3
    context.arc(
      x, //x co-ord
      y, //y co-ord
      50, //radius
      0, //start angle
      2 * Math.PI //end angle
    )
    context.fill()
    context.stroke()

    //set inner circle
    context.fillStyle = colour
    context.strokeStyle = colour
    context.beginPath();
    context.arc(
      x, //x co-ord
      y, //y co-ord
      30, //radius
      0, //start angle
      2 * Math.PI //end angle
    )
    context.fill()
    context.stroke()
  }

  //smaller stones
  function drawSmallStone (colour,x,y){
    //set outside circle for aesthetic
    context2.fillStyle = "grey"
    context2.strokeStyle = "grey"
    context2.beginPath();
    context2.arc(
      x, //x co-ord
      y, //y co-ord
      10, //radius
      0, //start angle
      2 * Math.PI //end angle
    )
    context2.fill()
    context2.stroke()

    //set inner circle
    context2.fillStyle = colour
    context2.strokeStyle = colour
    context2.beginPath();
    context2.arc(
      x, //x co-ord
      y, //y co-ord
      5, //radius
      0, //start angle
      2 * Math.PI //end angle
    )
    context2.fill()
    context2.stroke()
  }

}

//get stone at location where the mouse is pressed
function getStone (x,y){
  let context2 = canvas.getContext('2d')
  for (let i = 0; i < stones.length; i++) {
    if ((x > (stones[i].x-10) && x < (stones[i].x+10)) &&
        (y > (stones[i].y - 10) && y < (stones[i].y+10))) {
        return stones[i]
      }
    }
    return null
}

//set horizontal velocity and update current moving condition
function setvx (id,v){
  stones[id].vx = v
  moving = ((stones[id].vx != 0.0) || (stones[id].vy != 0.0))

}

//set horizontal velocity and update current moving condition
function setvy (id,v){
  stones[id].vy = v
  moving = ((stones[id].vx != 0.0) || (stones[id].vy != 0.0))

}

//update positioning of stone
function move (id){
  s = stones[id]
  if (s.moving){
    collisionTimer = setInterval (collision,20) //check for collision
    stoneMover = setInterval (stoneMove,20) //update stone location
  }
  else{ //end timers
    clearInterval(stoneMover)
    clearInterval(collisionTimer)
  }
}

//update stone velocity
function stoneMove (){
  for (i = 0;i<6;i++){
    absVx = Math.abs(stones[i].vx);
    absVy = Math.abs(stones[i].vy);


    stones[i].vx = stones[i].vx*friction //slow down due to friction
    stones[i].vy = stones[i].vy*friction //slow down due to friction

    //if the stone is moving very slowly declare it stopped
    if( (absVx < 0.08) && (absVy < 0.08) ) {
      stones[i].moving = false
      stones[i].vx = 0 //set velocity to zero
      stones[i].vy = 0
      if (!s.moving)
      clearInterval(stoneMover)
    }
    if (stones[i].x + 10 > canvas2.width || stones[i].x - 10 < 0) //check for out of bounds in the x coordinate and bounce
    {
      stones[i].vx *= -1
    }
    if (stones[i].y + 10 > canvas2.height) //check for out of bounds on the bottom of the canvas and bounce
    {
      stones[i].vy *= -1
    }
    if (stones[i].y - 15 < 0) //check for out of bounds above the canvas and stop the stone
    {
      stones[i].vy = 0
      stones[i].moving = false
    }

    //update position based on velocity
    stones[i].x = stones[i].x + stones[i].vx
    stones[i].y = stones[i].y + stones[i].vy

    //average velocity
    stones[i].velocity = Math.sqrt ((stones[i].vx * stones[i].vx) + (stones[i].vy * stones[i].vy))


    let dataObj = {
      x: stones[i].x,
      y: stones[i].y,
      vx: stones[i].vx,
      vy: stones[i].vy,
      id: stones[i].id
    }
    //create a JSON string representation of the data object
    var jsonString = JSON.stringify(dataObj)
    //update the server with a new location of the stone
    socket.emit('stoneData', jsonString)
  }
}

function handleMouseDown(e) {
  //get coordinate of where mouse is pressed
  let canvasMouseLoc = getCanvasMouseLocation(e)
  let canvasX = canvasMouseLoc.canvasX
  let canvasY = canvasMouseLoc.canvasY
  console.log("mouse down:" + canvasX + ", " + canvasY)

  //check for if there is a stone where mouse is pressed
  stone = getStone(canvasX, canvasY)
  if (stone != null) {
    if (stone.playerid === uniqueid){
      id = stone.id
      deltaX = canvasX
      deltaY = canvasY
      $("#canvas2").mousemove(handleMouseMove)
      $("#canvas2").mouseup(handleMouseUp)
    }

  }
e.stopPropagation()
e.preventDefault()

drawCanvas()
}

function handleMouseMove(e) {
  console.log("mouse move")
  //get mouse location relative to canvas top left
  let canvasMouseLoc = getCanvasMouseLocation(e)
  let canvasX = canvasMouseLoc.canvasX
  let canvasY = canvasMouseLoc.canvasY

  console.log("move: " + canvasX + "," + canvasY)

  finalX = canvasX
  finalY = canvasY

  //create horizontal and vertical power by subtracting where the mouse is pressed and where the mouse is released
  stones[id].powerx = (deltaX - finalX)/7
  stones[id].powery = (deltaY - finalY)/7

  //update stone location when dragging
  stones[id].x = canvasX
  stones[id].y = canvasY

  e.stopPropagation()


  let dataObj = {
    x: stones[id].x,
    y: stones[id].y,
    vx: stones[id].vx,
    vy: stones[id].vy,
    id: id
  }
  //create a JSON string representation of the data object
  var jsonString = JSON.stringify(dataObj)
  //update the server with a new location of the moving box
  socket.emit('stoneData', jsonString)
}

function handleMouseUp(e) {
  console.log("mouse up")
  $("#canvas2").off("mousemove", handleMouseMove) //remove mouse move handler
  $("#canvas2").off("mouseup", handleMouseUp);//remove mouse up handler
  e.stopPropagation()

  //update final horizontal and vertical velocity
  stones[id].moving = true
  stones[id].vx = stones[id].powerx
  stones[id].vy = stones[id].powery



  move(id)



  let dataObj = {
    x: stones[id].x,
    y: stones[id].y,
    vx: stones[id].vx,
    vy: stones[id].vy,
    id: id
  }
  //create a JSON string representation of the data object
  var jsonString = JSON.stringify(dataObj)

  //update the server with a new location of the moving box
  socket.emit('stoneData', jsonString)

  drawCanvas() //redraw the canvas
}

function getCanvasMouseLocation(e) {

  let rect = canvas2.getBoundingClientRect()

  //account for amount the document scroll bars might be scrolled
  let scrollOffsetX = $(document).scrollLeft()
  let scrollOffsetY = $(document).scrollTop()

  let canX = e.pageX - rect.left - scrollOffsetX
  let canY = e.pageY - rect.top - scrollOffsetY

  return {
    canvasX: canX,
    canvasY: canY
  }

}
function handleTimer() {
  drawCanvas()
}

//KEY CODES
//should clean up these hard coded key codes
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40

function getCanvasMouseLocation(e) {
  //provide the mouse location relative to the upper left corner
  //of the canvas

  let rect = canvas2.getBoundingClientRect()

  //account for amount the document scroll bars might be scrolled
  let scrollOffsetX = $(document).scrollLeft()
  let scrollOffsetY = $(document).scrollTop()

  let canX = e.pageX - rect.left - scrollOffsetX
  let canY = e.pageY - rect.top - scrollOffsetY

  return {
    canvasX: canX,
    canvasY: canY
  }

}


function isTouching (){
  //get current x and y coordinate and velocity of the stone
  let id = stone.id
  stones[id].x = stone.x
  stones[id].y = stone.y
  stones[id].velocity = stone.velocity
  for (let i = 0; i < stones.length; i++){
    if (id != i){
      //check if their is a stone nearby
      if (stones[id].x < stones[i].x  + 20 && stones[id].x > stones[i].x - 20 && stones[id].y < stones[i].y + 20 && stones[id].y > stones[i].y-20){
        collisionStones = {s1: stones[id], s2: stones[i]} //update array of the colliding stones
        return true
      }
    }
  }
  return false
}

//handle collisions
function collision (){
  if (isTouching()){
    s1 = collisionStones.s1
    s2 = collisionStones.s2


    //get velocity
    v = s1.velocity

    //get displacement
    dx = Math.abs(s2.x - s1.x)
    dy = Math.abs(s1.y - s2.y)
    dist12 = Math.sqrt (dx*dx+dy*dy)

    //determine angle of line of impact with horizontal
    angle_b = Math.asin(dy/dist12)

    //determine angle of stone 1 velocity with vertical
    angle_d = Math.asin(dx/dist12)

    //determine angle of stone 1 velocity line of impact
    angle_a = (3.14159/2.0) - angle_b - angle_d

    //determine angle of stone 1 departure with horizontal
    angle_c = angle_b - angle_a

    //new velocity vectors;
    v1 = v * Math.abs(Math.sin(angle_a))
    v2 = v* Math.abs(Math.cos(angle_a))

    //calculate horizontal and vertical velocities for both stones
    v1x = v1 * Math.abs(Math.cos(angle_c))
    v1y = v1 * Math.abs(Math.sin(angle_c))
    v2x = v2 * Math.abs(Math.cos(angle_b))
    v2y = v2 * Math.abs(Math.sin(angle_b))

    //change direction of stones if needed
    if(s1.vx > 0){
        if(s1.x < s2.x)
          v1x = -v1x
        else
         v2x = -v2x
    }
    else {
      if(s1.x > s2.x)
        v2x = -v2x
      else
        v1x = -v1x
    }

    if(s1.vy > 0){
      if(s1.y < s2.y)
        v1y = -v1y
      else
       v2y = -v2y
    }
    else {
     	if(s1.y > s2.y)
        v2y = -v2y
      else
        v1y = -v1y
    }


    //update stones velocities
    setvx(s1.id,v1x)
    setvy(s1.id,v1y)

    setvx(s2.id,v2x)
    setvy(s2.id,v2y)

    move (s2.id)

  }
}

//connect to server and retain the socket
let socket = io('http://' + window.document.location.host)

function assignPlayer(){
  //get text inside textfield
  let userText = $('#userTextField').val()
  let textDiv = document.getElementById("text-area")
  if (userText && userText !== '' && !hasid) {
    uniqueid = userText
    $('#userTextField').val('') //clear the user text field

    //if there is no player 1
    if (p1stones[0].playerid === null){
      for (let i = 0;i<p1stones.length;i++){
        p1stones[i].playerid = userText
        p1stones[i].colour = "red"
      }
      hasid = true
      pNames[0]=userText
    }
    //if there is no player 2
    else if (p2stones[0].playerid === null){
      for (let i = 0;i<p2stones.length;i++){
        p2stones[i].playerid = userText
        p2stones[i].colour = "yellow"
      }
      hasid = true
      pNames[1]= userText
    }
    let dataObj = {
      p1: p1stones,
      p2: p2stones,
      pName: pNames
    }
    //create a JSON string representation of the data object
    var jsonString = JSON.stringify(dataObj)

    //update the server with a new location of the moving box
    socket.emit('playerData', jsonString)
  }
}

function unassignPlayer(){
  //if the current browser is the first player
  if (p1stones[0].playerid === uniqueid){
    for (let i = 0;i<p1stones.length;i++){
      p1stones[i].playerid = null
      p1stones[i].colour = "white"
    }
    hasid= false
    pNames [0] = ""
  }
  //if the current browser is the second player
  else if (p2stones[0].playerid === uniqueid){
    for (let i = 0;i<p2stones.length;i++){
      p2stones[i].playerid = null
      p2stones[i].colour = "white"
    }
    hasid= false
    pNames [1] = ""
  }
  let dataObj = {
    p1: p1stones,
    p2: p2stones,
    pName: pNames
  }
  //create a JSON string representation of the data object
  var jsonString = JSON.stringify(dataObj)

  //update the server with a new location of the moving box
  socket.emit('playerData', jsonString)
}

socket.on('playerData',function(data){ // update player data
  let playerData = JSON.parse(data)
  p1 = playerData.p1
  p2 = playerData.p2
  pName = playerData.pName

  //update which stones belong to which player
  for (let i=0;i<p1stones.length;i++){
    p1stones[i] = p1[i]
    p2stones[i] = p2[i]
  }

  //update player one stones
  for (let i = 0;i<p1stones.length;i++){
    stones[i] = p1stones[i]
  }

  //update player two stones
  for (let i = 0;i<p2stones.length;i++){
    stones[i+3] = p2stones[i]
  }

  //update text area
  pNames[0] = pName [0]
  pNames[1] = pName [1]


})

socket.on('stoneData', function(data) { //update stone data
  let locationData = JSON.parse(data)
  for (let i = 0; i< stones.length;i++){
    if (stones[i].id === locationData.id){ //check for the same stone and update coordinates and velocities
      stones[i].x = locationData.x
      stones[i].y = locationData.y
      stones[i].vx = locationData.vx
      stones[i].vy = locationData.vy
    }
  }
  drawCanvas()
})

$(document).ready(function() {
  //add mouse down listener to our canvas object
  $("#canvas2").mousedown(handleMouseDown)

  timer = setInterval(handleTimer, 100) //tenth of second

  drawCanvas()
})
