/*
(c) 2018 Louis. D. Nel

NOTE: THIS CODE WILL NOT RUN UNTIL YOU ENTER YOUR OWN openrecipemap.org APP ID KEY

NOTE: You need to intall the npm modules by executing >npm install
before running this server

Simple express server re-serving data from openrecipemap.org
To test:
http://localhost:3000
or
http://localhost:3000/recipe?ingredient=Ottawa
to just set JSON response. (Note it is helpful to add a JSON formatter extension, like JSON Formatter, to your Chrome browser for viewing just JSON data.)
*/
const express = require('express') //express framework
const requestModule = require('request') //npm module for easy http requests
const https = require('https') //food2fork now requires https
let http = require('http')
let url = require('url')
let qstring = require('querystring')

const PORT = process.env.PORT || 3000
/*YOU NEED AN APP ID KEY TO RUN THIS CODE
  GET ONE BY SIGNING UP AT openrecipemap.org
*/
const API_KEY = '1fb4c5ae4d3f2822ab7efa331764627a'

const app = express()

//Middleware
// static file serve
app.use(express.static(__dirname + '/public'))
// not found in static files, so default to index.html

app.get(`/*`, (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

app.post('/fetchRecipe', function (req, res) {
  let reqData = ''
  req.on('data', function (chunk) {
      reqData += chunk
  })

  req.on('end', function () {
      let dataObj = JSON.parse (reqData)
      let name = dataObj.name
      name = name.replace(/\s/g, '');
      getRecipes(name, res)
  })

})


function parseData(recipeResponse, res) {
  let recipeData = ''
  recipeResponse.on('data', function (chunk) {
      recipeData += chunk
  })
  recipeResponse.on('end', function () {
      res.send (recipeData)
  })
}
function getRecipes(ingredient, res){
    //You need to provide an appid with your request.
    //Many API services now require that clients register for an app id.
  const options = {
     host: 'www.food2fork.com',
     path: `/api/search?q=${ingredient}&key=${API_KEY}`
  }
  https.request(options, function(apiResponse){
    parseData(apiResponse, res)
  }).end()
}

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
    console.log(`Server listening on port: ${PORT}`)
    console.log(`To Test:`)
    console.log(`http://localhost:3000/recipe?ingredient=Basil`)
    console.log(`http://localhost:3000/recipes.html`)
    console.log(`http://localhost:3000/recipes`)
    console.log(`http://localhost:3000/index.html`)
    console.log(`http://localhost:3000/`)
    console.log(`http://localhost:3000`)

  }
})
