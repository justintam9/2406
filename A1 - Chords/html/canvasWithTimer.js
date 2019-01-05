/*
COMP 2406 (c) Justin Tam

Javascript to read a chord-pro file and display it
as an HTML file. The user will also have the ability
to transpose the chords up and down

*/

//Use javascript array of objects to represent words and their locations
let words = []

let chords = []

let wayPoints = [] //used for locations where the moving box has been

let timer //use for animation motion

let wordBeingMoved

let deltaX, deltaY //location where mouse is pressed
const canvas = document.getElementById('canvas1'); //our drawing canvas

function getWordAtLocation(aCanvasX, aCanvasY) {

  //locate the word near aCanvasX,aCanvasY
	  var context = canvas.getContext('2d')
	  context.font = '20pt Arial'

	  for(var i=0; i<words.length; i++){
			for(var j=0; j<words[i].length; j++){
	     var wordWidth = context.measureText(words[i][j].word).width //save length of current word

			 //check if coordinates of mouse match a word
		 if((aCanvasX > words[i][j].x && aCanvasX < (words[i][j].x + wordWidth))  &&
		    Math.abs(words[i][j].y - aCanvasY) < 20) return words[i][j]
	  }
	}
	  return null
}

function drawCanvas() {

  let context = canvas.getContext('2d')

  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height) //erase canvas

  context.font = '15pt Arial'
  context.fillStyle = 'cornflowerblue'
  context.strokeStyle = 'blue'

  for (let i = 0; i < chords.length; i++) {
		let t =20
		for (let j = 0; j < chords[i].length; j++) {
  		let data = chords[i][j]
			let temp_string = JSON.stringify(data.word) //save lyric as a string
			//display chords as green and lyrics as blue
				if (temp_string.includes ("[")) //if element is a chord
					{
					context.fillStyle = 'green'
					context.strokeStyle = 'green'
					context.fillText(data.word, data.x, data.y)
	  			context.strokeText(data.word, data.x, data.y)
				}
			else { //if element is a lyric
				context.fillStyle = 'cornflowerblue'
		  	context.strokeStyle = 'blue'
  			context.fillText(data.word, data.x, data.y)
  			context.strokeText(data.word, data.x, data.y)
			}
		}
  }
  context.stroke()
}

function handleMouseDown(e) {

  //get mouse location relative to canvas top left
  let rect = canvas.getBoundingClientRect()
  //var canvasX = e.clientX - rect.left
  //var canvasY = e.clientY - rect.top
  let canvasX = e.pageX - rect.left //use jQuery event object pageX and pageY
  let canvasY = e.pageY - rect.top
  console.log("mouse down:" + canvasX + ", " + canvasY)

  wordBeingMoved = getWordAtLocation(canvasX, canvasY)
  //console.log(wordBeingMoved.word)
  if (wordBeingMoved != null) {
    deltaX = wordBeingMoved.x - canvasX
    deltaY = wordBeingMoved.y - canvasY
    //document.addEventListener("mousemove", handleMouseMove, true)
    //document.addEventListener("mouseup", handleMouseUp, true)
    $("#canvas1").mousemove(handleMouseMove)
    $("#canvas1").mouseup(handleMouseUp)

  }

  // Stop propagation of the event // TODO:  stop any default
  // browser behaviour

  e.stopPropagation()
  e.preventDefault()

  drawCanvas()
}

function handleMouseMove(e) {

  console.log("mouse move")

  //get mouse location relative to canvas top left
  let rect = canvas.getBoundingClientRect()
  let canvasX = e.pageX - rect.left
  let canvasY = e.pageY - rect.top

  wordBeingMoved.x = canvasX + deltaX
  wordBeingMoved.y = canvasY + deltaY

  e.stopPropagation()

  drawCanvas()
}

function handleMouseUp(e) {
  console.log("mouse up")

  e.stopPropagation()

  //$("#canvas1").off(); //remove all event handlers from canvas
  //$("#canvas1").mousedown(handleMouseDown); //add mouse down handler

  //remove mouse move and mouse up handlers but leave mouse down handler
  $("#canvas1").off("mousemove", handleMouseMove) //remove mouse move handler
  $("#canvas1").off("mouseup", handleMouseUp) //remove mouse up handler

  drawCanvas() //redraw the canvas
}

//JQuery Ready function -called when HTML has been parsed and DOM
//created
//can also be just $(function(){...});
//much JQuery code will go in here because the DOM will have been loaded by the time
//this runs

function handleTimer() {

  drawCanvas()
}

//KEY CODES
const ENTER = 13
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40


function handleKeyDown(e) {

  console.log("keydown code = " + e.which)

  let keyCode = e.which
  if (keyCode == UP_ARROW | keyCode == DOWN_ARROW) {
    //prevent browser from using these with text input drop downs
    e.stopPropagation()
    e.preventDefault()
  }

}

function handleKeyUp(e) {
  console.log("key UP: " + e.which)
  if (e.which == ENTER) {
    handleSubmitButton() //treat ENTER key like you would a submit
    $('#userTextField').val('') //clear the user text field
  }

  e.stopPropagation()
  e.preventDefault()
}

function handleSubmitButton() {

  let userText = $('#userTextField').val(); //get text from user text input field
  if (userText && userText != '') {
    //user text was not empty

    let userRequestObj = {
      text: userText
    } //make object to send to server
    let userRequestJSON = JSON.stringify(userRequestObj) //make JSON string
    $('#userTextField').val('') //clear the user text field
    //Prepare a POST message for the server and a call back function
    //to catch the server repsonse.
    //alert ("You typed: " + userText)
    $.post("userText", userRequestJSON, function(data, status) {
      responseObj = JSON.parse(data)
      //replace word array with new words if there are any
			if (responseObj.wordArray) {
				words = responseObj.wordArray
				let textDiv = document.getElementById("text-area") //get text area
				textDiv.innerHTML = ""
				chords = [] //create array
				let context = canvas.getContext('2d') //get canvas

				for (i = 0;i<words.length;i++){
					let temp_x = 0
					chords [i] = [] //create 2d array
					for (j = 0;j<words[i].length;j++){
						chords[i][j]= words[i][j] //seperate text field array and canvas array

						chords[i][j].x = temp_x //save an x value on the canvas
						let temp_string = JSON.stringify(words[i][j].word)//save the current lyric as a string

						//check size of the element to create an x value
						if (temp_string.includes ("[")) //if element is a chord
						{
							temp_x += context.measureText (temp_string).width
						}
						else { //if element is a lyric
							temp_x += context.measureText (temp_string).width + 10
						}

	    			textDiv.innerHTML = textDiv.innerHTML + words[i][j].word + " " //display single lyric on text field
					}
					textDiv.innerHTML = textDiv.innerHTML + `<p> ${"\n"}</p>` //create a line on text field
				}
			}
			else{ //if the song doesnt exist clear the text area
				let textDiv = document.getElementById("text-area")
				textDiv.innerHTML = ""
				chords =[]
			}
    })


  }
}

//transpose chords up
function handleTransposeUp(){
	var current_chord
	var temp_chord

	//loop through all the lyrics
	for (i = 0;i<chords.length;i++){
		for (j = 0;j<chords[i].length;j++){
			current_chord = JSON.stringify(chords[i][j]) //convert current lyric to a string
			//if its a chord, transpose it up
			if (current_chord.includes ("[")){
				if (current_chord.includes ("A#"))
					temp_chord = current_chord.replace (/A#/g,"B")
				else if (current_chord.includes ("A"))
					temp_chord = current_chord.replace (/A/g,"A#")
				if (current_chord.includes ("B"))
					temp_chord = current_chord.replace (/B/g,"C")
				if (current_chord.includes ("C#"))
					temp_chord = current_chord.replace (/C#/g,"D")
				else if (current_chord.includes ("C"))
					temp_chord = current_chord.replace (/C/g,"C#")
				if (current_chord.includes ("D#"))
					temp_chord = current_chord.replace (/D#/g,"E")
				else if (current_chord.includes ("D"))
					temp_chord = current_chord.replace (/D/g,"D#")
				if (current_chord.includes ("E"))
					temp_chord = current_chord.replace (/E/g,"F")
				if (current_chord.includes ("F#"))
					temp_chord = current_chord.replace (/F#/g,"G")
				else if (current_chord.includes ("F"))
					temp_chord = current_chord.replace (/F/g,"F#")
				if (current_chord.includes ("G#"))
					temp_chord = current_chord.replace (/G#/g,"A")
				else if (current_chord.includes ("G"))
					temp_chord = current_chord.replace (/G/g,"G#")


				chords[i][j] = JSON.parse(temp_chord) //convert back to JSON
				temp_chord = "" //empty temp chord
			}
		}
	}
}

//transpose chords down
function handleTransposeDown(){
	var current_chord
	var temp_chord

	//loop through all the lyrics
	for (i = 0;i<chords.length;i++){
		for (j = 0;j<chords[i].length;j++){
			current_chord = JSON.stringify(chords[i][j]) //convert current lyric to a string

			//if its a chord, trasnpose it down
			if (current_chord.includes ("[")){
				if (current_chord.includes ("A#"))
					temp_chord = current_chord.replace (/A#/g,"A")
				else if (current_chord.includes ("A"))
					temp_chord = current_chord.replace (/A/g,"G#")
				if (current_chord.includes ("B"))
					temp_chord = current_chord.replace (/B/g,"A#")
				if (current_chord.includes ("C#"))
					temp_chord = current_chord.replace (/C#/g,"C")
				else if (current_chord.includes ("C"))
					temp_chord = current_chord.replace (/C/g,"B")
				if (current_chord.includes ("D#"))
					temp_chord = current_chord.replace (/D#/g,"D")
				else if (current_chord.includes ("D"))
					temp_chord = current_chord.replace (/D/g,"C#")
				if (current_chord.includes ("E"))
					temp_chord = current_chord.replace (/E/g,"D#")
				if (current_chord.includes ("F#"))
					temp_chord = current_chord.replace (/F#/g,"F")
				else if (current_chord.includes ("F"))
					temp_chord = current_chord.replace (/F/g,"E")
				if (current_chord.includes ("G#"))
					temp_chord = current_chord.replace (/G#/g,"G")
				else if (current_chord.includes ("G"))
					temp_chord = current_chord.replace (/G/g,"F#")

				chords[i][j] = JSON.parse(temp_chord) //convert back to JSON
				temp_chord = "" //empty temp chord
			}
		}
	}
}

$(document).ready(function() {
  //This is called after the broswer has loaded the web page

  //add mouse down listener to our canvas object
  $("#canvas1").mousedown(handleMouseDown)

  //add key handler for the document as a whole, not separate elements.
  $(document).keydown(handleKeyDown)
  $(document).keyup(handleKeyUp)

  timer = setInterval(handleTimer, 100)
  //clearTimeout(timer) //to stop

  drawCanvas()
})
