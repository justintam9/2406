function buttonClick() {
  var url_string = window.location.href
  var url = new URL(url_string);
  var c = url.searchParams.get("recipe");

  let ingredient= document.getElementById('ingredient').value
  if(ingredient === '') {
      return alert('Please enter a ingredient')
  }
  getRecipes(ingredient)
}

function getRecipes(ingredientName){
  let ingredientDiv = document.getElementById('ingredientrecipe')
  ingredientDiv.innerHTML = ''
  let userRequestObj =  {name: ingredientName}
  let userRequestJSON = JSON.stringify (userRequestObj)

  $.post ("fetchRecipe", userRequestJSON, function (data){
    let recipeData = JSON.parse(data)
    console.log(recipeData)
    for (let i = 0; i<recipeData.count;i++){
      let rec = recipeData.recipes[i]
      ingredientDiv.innerHTML += '<div style = "display:inline-block; height:450px; width:350px; word-wrap:break-word;border:1px solid black; margin:30px;">'
                                    + ` <a href = "${rec.f2f_url}"target="_blank"><img src="${rec.image_url}" height ="350" width = "350"></a>`
                                    + `<h2 style = "text-align:center;"> <a href = "${rec.f2f_url}"target="_blank">${rec.title}</a></h2></div>`
    }
  })
}

$(document).ready(function(){
  var ingredient = window.location.search;
  ingredient = ingredient.replace("?ingredient=", '');
  if (ingredient != ''){
    getRecipes (ingredient)
  }

})


//Attach Enter-key Handler
const ENTER=13
document.getElementById("ingredient")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === ENTER) {
        document.getElementById("submit").click();
    }
});
