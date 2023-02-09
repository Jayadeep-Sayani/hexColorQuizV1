let theAnswerForm = document.getElementById("form");
let possibleHexValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'A', 'B', 'C', 'D', 'E', 'F'];
let difficultyNumber;
let gameName;
let questionNumber = 0
let score = 0
let nextButton = document.getElementById("next");
let colorCodeForQuestion;
let colorBox = document.getElementById("color-box");

nextButton.addEventListener('click', function() {
  let selectedValue;
  let selectedRadioButton;
  let choices = document.querySelectorAll('.choice');
  choices.forEach(choice => {
    if (choice.checked) {
      selectedRadioButton = choice;
    }
  });
  if (selectedRadioButton) {
    let selectedRadioButtonId = selectedRadioButton.id;
    let selectedLabel = document.querySelector(`label[for="${selectedRadioButtonId}"]`);
    if (gameName == "guessCode") {
      selectedValue = selectedLabel.innerText;
    } else if (gameName == "guessColor") {
      selectedValue = selectedLabel.style.backgroundColor;
    }

    checkCorrectOrWrong(selectedValue);
  } else {
    return null
  }


});


document.getElementById("levelButton").addEventListener('click', function() {
  let difficulties = document.querySelectorAll(".difficulties")
  let selectedDifficulty;
  difficulties.forEach(difficulty => {
    if (difficulty.checked) {
      selectedDifficulty = difficulty
      console.log(selectedDifficulty);
    }
  })
  if (selectedDifficulty) {
    if (selectedDifficulty.id == 'easy') {
      difficultyNumber = 2;
    } else if (selectedDifficulty.id == 'medium') {
      difficultyNumber = 4;
    } else if (selectedDifficulty.id == 'hard') {
      difficultyNumber = 8;
    }
    document.getElementById("difficultyContainer").style.display = "none";
    loadQuestion()
  } else {
    return null
  }

});

document.getElementById("gameButton").addEventListener('click', function() {
  let games = document.querySelectorAll(".games")
  let selectedGame;
  games.forEach(game => {
    if (game.checked) {
      selectedGame = game
    }
  })
  if (selectedGame) {
    if (selectedGame.id == 'codetocolor') {
      gameName = "guessColor";
    } else if (selectedGame.id == 'colortocode') {
      gameName = "guessCode";
    }
    document.getElementById("selectGame").style.display = "none";
    // loadQuestion()
  } else {
    return null
  }
  console.log(gameName);

});



window.onload = function () {
  loadQuestion();
};

function loadQuestion() {
  theAnswerForm.innerHTML = "";
  questionNumber++;
  generateHexCode();
  if (questionNumber == 10) {
    nextButton.innerText = "Finish";
  }

}

function generateHexCode() {

  let emptyHexCodeArray = ['#'];

  for (let i = 0; i < 6; i++) {
    emptyHexCodeArray.push(possibleHexValues[Math.floor(Math.random() * possibleHexValues.length)]);   
  }

  colorCodeForQuestion = emptyHexCodeArray.join('');

  if (gameName== "guessCode") {
    colorBox.style.background = colorCodeForQuestion;
    document.getElementById("maintitle").innerText = "What color code is this colour?"
  } else if (gameName== "guessColor") {
    colorBox.innerText = colorCodeForQuestion;
    colorBox.style.background = "transparent";
    colorBox.style.display = "flex";
    colorBox.style.border = "none";
    colorBox.style.justifyContent = "center";
    colorBox.style.alignItems = "center";
    colorBox.style.fontFamily = "sans-serif";
    colorBox.style.fontSize = "3em";
    colorBox.style.color = "#fff";
    document.getElementById("maintitle").innerText = "What color is this colour code?"
  }



  generateChoices(colorCodeForQuestion);
}

function generateChoices(colorCodeForQuestion) {
  let arrayOfChoices = [];
  arrayOfChoices.push(colorCodeForQuestion);
  for (let j = 0; j < difficultyNumber - 1; j++) {
    let emptyHexCodeArray = ['#'];
    for (let i = 0; i < 6; i++) {
      emptyHexCodeArray.push(possibleHexValues[Math.floor(Math.random() * possibleHexValues.length)]); 
    }
    arrayOfChoices.push(emptyHexCodeArray.join(''));
  }

  shuffleArray(arrayOfChoices)
}



function shuffleArray(arrayOfChoices) {
  for (let i = arrayOfChoices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayOfChoices[i], arrayOfChoices[j]] = [arrayOfChoices[j], arrayOfChoices[i]];
  }
  generateButtons(arrayOfChoices);
}



function generateButtons(arrayOfChoices) {
  arrayOfChoices.forEach(item => {
    let newChoice = document.createElement('input');
    let newChoiceText = document.createElement('label');
    if (gameName == "guessColor") {
      newChoiceText.style.backgroundColor = item;
      newChoiceText.style.border = "3px solid #fff";
    } else if (gameName == "guessCode") {
      newChoiceText.innerText = item;
    }
    newChoiceText.setAttribute('for', item);
    newChoiceText.setAttribute('class', 'choice-text');
    newChoice.type = "radio";
    newChoice.setAttribute('name', 'answers')
    newChoice.setAttribute('id', item);
    newChoice.setAttribute('class', 'choice');
    theAnswerForm.append(newChoice);
    theAnswerForm.append(newChoiceText);
  });
}

function checkCorrectOrWrong(selectedValue) {
  let questionResult;
  if (gameName == "guessCode") {
    if (colorCodeForQuestion == selectedValue) {
      questionResult = "correct";
      score = score + 1
    } else {
      questionResult= "wrong"
    }
  } else if (gameName == "guessColor"){
    
    if (selectedValue === "rgb(" + hexToRgb(colorCodeForQuestion).r + ", " + hexToRgb(colorCodeForQuestion).g + ", " + hexToRgb(colorCodeForQuestion).b + ")") {
      questionResult = "correct";
      score = score + 1
    } else {
      questionResult= "wrong";
    }
    
  }
  showCorrectOrWrong(questionResult)
}

function showCorrectOrWrong(questionResult) {
  if (questionNumber != 10) {
    if (questionResult == 'correct') {
      document.getElementById("prevResult").innerText = "Correct!";
    } else {
      document.getElementById("prevResult").innerText = "Wrong";
    }


    document.getElementById("score").innerHTML = score;
    loadQuestion();
  } else {
    document.getElementById("finalResults").style.display = "flex";
    document.getElementById("finalScore").innerText = score;
  }
}

document.getElementById("playAgain").addEventListener("click", function() {
  location.reload()
});


function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}