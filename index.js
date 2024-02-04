


function getExercise() {
  let muscleElem = document.getElementById('dropdownType');
  let muscle = muscleElem.value;
  let numElem = document.getElementById('exNum');
  let num = numElem.value;
  
  let difficultyElem  = document.getElementById('dropdownDiff')
  let difficulty = difficultyElem.value
  let diffNum = 10
  if(num < 0){
      return;
  }
  
  if(num == 0){
      num = 9999
  }
  let display = []
  if(difficulty == 'beginner'){
      diffNum = 1
  }else if(difficulty == "intermediate") {
      diffNum = 2
  }else{
      diffNum = 3
  }

  $.ajax({
      method: 'GET',
      url: 'https://api.api-ninjas.com/v1/exercises?muscle=' + muscle,
      headers: { 'X-Api-Key': 'HyufkDepdUpM5bVIOYLOeg==a9EZI62GZy7qJjbV'},
      contentType: 'application/json',
      success: function(result) { 
          document.getElementById("mainEx").innerHTML = "";
          

          var j = 0;

          

          for (i = 0; i < result.length; i++) {
              if(result[i].difficulty == 'beginner'){
                  result[i].diffNum = 1
              }else if(result[i].difficulty == 'intermediate') {
                  result[i].diffNum = 2
              }else{
                  result[i].diffNum = 3
              }

              if(result[i].diffNum <= diffNum){
                  var div = document.createElement("div");
                  div.id = "child" + i;

                  var name = document.createElement("h6");
                  name.id = "name";
                  name.innerHTML = result[i].name;
                  div.appendChild(name);

                  var type = document.createElement("h4");
                  type.id = "type";
                  type.innerHTML = result[i].type;
                  div.appendChild(type);


                  var instructions = document.createElement("nav");
                  instructions.id = "instructions";
                  instructions.innerHTML = result[i].instructions;
                  div.appendChild(instructions);

                  var addButton = document.createElement("button")
                  addButton.id = "addButton"
                  addButton.type = "button"
                  addButton.innerHTML = "Add this to Your Workout"
                  addButton.addEventListener('click', () => {
                    event.preventDefault()
                    addEx(name) // Trigger the function when the button is clicked
                });
                  div.appendChild(addButton)
                  

                

                  document.getElementById("mainEx").appendChild(div);
                  j++;
                  display.push(div)
              }
              
              if (j  >= num) {
                  break;
              }
              
          
          }
          if (num > j && num != 9999) {
              alert("Too many requests to display. Only " + j+ " results will be displayed.");
          }
        
      },
      error: function ajaxError(jqXHR) {
          alert('Error: ' + jqXHR.responseText);
      }
  });
}

function getDailyNutrients()
{
    //this function uses the user's weight to calculate the amount of nutrients they should consume daily
    //takes the user's info from the input fields (their id is surrounded by the '' )
    let weight = document.getElementById('weight').value;
    let height = document.getElementById('height').value;
    let age = document.getElementById('age').value;
    let gender = document.getElementById('sex').value;
    let bmr = 0
    console.log(gender)
    if (gender == "male")
    {
        bmr = 66.47 + (6.23865* weight) + (5.003 * height) - (6.75 * age);
    }
    else if(gender == "female")
    {
        bmr = 655.1 + (4.3389 * weight) + (1.850 * height) - (4.676 * age);
    }
    else
    {
        alert("Invalid Sex")
    }

    var cal1 = bmr * 1.2;
    var cal2 = bmr * 1.375;
    var cal3 = bmr * 1.55;
    var cal4 = bmr * 1.725;
    var cal5 = bmr * 1.9;

    let minProtein = weight * 0.35;
    let maxProtein = weight;

    let minCarbs = cal1 * 0.45;
    let maxCarbs = cal1 * 0.65;
    minCarbs = minCarbs / 4;
    maxCarbs = maxCarbs / 4;

    let minFat = cal1 * 0.2
    let maxFat = cal1 * 0.3;
    minFat = minFat / 9;
    maxFat = maxFat / 9;
    
    let output = " Calories burned per day: " + "\n No exercise: " + cal1 + "\n Light exercise: " + cal2 + "\n Moderate exercise: " + cal3 + "\n Heavy exercise: " + cal4 + "\n Very heavy exercise: " + cal5 + "\n Protein intake should be between " + minProtein + " and " + maxProtein + " grams per day." + "\n Carbohydrate intake should be between " + minCarbs + " and " + maxCarbs + " grams per day." + "\n Fat intake should be between " + minFat + " and " + maxFat + " grams per day.";
    //display the results on the webpage
    let result = document.createElement('h2') //create a new h2 element
    result.innerHTML = output; //set the innerHTML of the h2 element to the output string
    document.getElementById("output").appendChild(result); //append the h2 element to the 'mainCal' div
}

let array = []
function getCalories(){
  var activity = document.getElementById('dropdownAct').value
  var time = document.getElementById('timeNum').value
  var cal = document.getElementById('calNum').value
  if(cal < 50 && cal > 0){
      cal = 50
  }else if(cal >500){
      cal = 500
  }else if(cal > 50 && cal < 500){
      cal = cal
  }
  else{
      alert('wieght value is invalid please retry')
      return
  }

  if(time < 0){
      alert('time value is invalid please retry')
      return;
  }

  if(activity == 'other'){
      activity = document.getElementById('otherInput').value
  }
  
  $.ajax({
      method: 'GET',
      url: 'https://api.api-ninjas.com/v1/caloriesburned?activity=' + activity,
      headers: { 'X-Api-Key': 'HyufkDepdUpM5bVIOYLOeg==a9EZI62GZy7qJjbV'},
      contentType: 'application/json',
      success: function(result) {
          if(result.length == 0){
              alert(result)
              alert('activity could not be found please retry with a more broader description')
              return;
          }else if(result.length == 1){
              var calc = result[0].calories_per_hour * (time/60)
              let result = document.createElement('p')
              result.innerHTML ='you burned ' + calc + ' calories'
              return calc

          }
          document.getElementById("mainActList").innerHTML = "";
          let label =  document.createElement('p')

          for(i = 0; i < result.length; i++){
              document.getElementById("mainActList").appendChild(createRadioButton(result[i].name));
              document.createElement('p')
              array.push(result[i])
          }
      },
      error: function ajaxError(jqXHR) {
          console.error('Error: ', jqXHR.responseText);
      }
  });
}

function handleDropdownChange() {
  var dropdown = document.getElementById('dropdownAct');
  var otherInput = document.getElementById('otherInput');

  if (dropdown.value === 'other') {
      otherInput.style.display = 'block';
  } else {
      otherInput.style.display = 'none';
  }
}

function createRadioButton(value) {
  var label = document.createElement('label');

  var radioButton = document.createElement('input');
  radioButton.type = 'radio';
  radioButton.name = 'exerciseType';
  radioButton.value = value;
  radioButton.addEventListener('click',function(){
      displaySelectedValue()
  })

  label.appendChild(radioButton);
  label.appendChild(document.createTextNode(value));

  return label;
}

function displaySelectedValue(){
  let final = -1
  var time = document.getElementById('timeNum').value
  var form = document.getElementById('mainActList')
  let radios = form.elements['exerciseType']

  for(i = 0; i < radios.length; i++){
      if (radios[i].checked){
          final = i
      }
  }
  if(final == -1){
      let head = document.createElement("h6")
      head.innerHTML ="Please select a element to display"
  }else{
      let head = document.createElement("h6")
      let calc = array[final].calories_per_hour * (time/60)
      head.innerHTML = 'you burned ' + calc + ' calories'
      document.getElementById("mainActList").appendChild(head);
  }
}

