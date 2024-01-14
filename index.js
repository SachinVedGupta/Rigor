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