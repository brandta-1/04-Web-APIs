//initialize html document variables
var sb = document.querySelector(".s-btn");
var currQ = document.querySelector(".q");
var currA = document.querySelector(".a");
var theTime = document.querySelector(".countdown");
var score = document.querySelector(".score");
var tableHS = document.querySelector(".table");
var initials = document.getElementById("msg");
var timeDisplay = document.querySelector(".time");

//initialize js variables
var right = 0;
var wrong = 0;
var tLeft = 120;
var time;

//begins the game by disabling start button and calling game time and quiz functions
function begin() {

    //if the game has already been played, reload
    if (tLeft < 120) {
        location.reload();
    }

    //display answer choices
    timeDisplay.style.display = "flex";
    timeDisplay.style.justifyContent = "center";
    timeDisplay.style.fontSize = "30px";
    currA.style.display = "inline-block";
    tLeft = 120;
    sb.textContent = "Good Luck!";
    sb.disabled = true;
    cd();
    startGame();
}

//countdown time function
function cd() {
    time = setInterval(function () {
        tLeft--;
        //without this if statement, the quiz can break if the user clicks too quickly
        if (right + wrong !== allQ) {
            theTime.textContent = tLeft;
        }
        //if the timer runs out, or all questions have been answered, game over
        if (tLeft <= 0 || right + wrong === allQ) {
            clearInterval(time);
        }
    }, 1000);
}

//generate question function
function genQ() {
    //draw a random question from the bank, and then remove it from the bank
    const r = Math.floor(Math.random() * quiz.length);
    const currQuizQ = quiz[r];
    quiz.splice(r, 1);

    //draw the question onto the screen
    currQ.textContent = currQuizQ.qQ;
    for (var i = 0; i < 4; i++) {
        document.querySelector("#a-" + i).textContent = currQuizQ.qC[i];
    }

    //return the randomly drawn question so the click listener can acccess it
    return currQuizQ;
}

var answered = false;
function startGame() {
    //when the game begins, draw the player score and a random question
    updateScore();
    var currQuizQ = genQ();

    currA.addEventListener("click", function (event) {

        //player is right if they clicked the right answer, update the score
        if (event.target.id == "a-" + currQuizQ.qA) {
            answered = true;
            right++;
            updateScore();

            //if they clicked on an answer that was wrong, they are wrong, update the score and subtract time
        } else if (event.target.className == "ans") {
            answered = true;
            wrong++;
            tLeft = tLeft - 10;
            updateScore();
        }
        //if there are still questions left, then draw another question
        //answered boolean makes sure the user has submitted an answer
        if (answered === true) {
            if (quiz.length > 0) {
                currQuizQ = genQ();
                answered = false;
            } else {
                endGame();
            }
        }
    })
}

//draw current score to screen
function updateScore() {
    score.textContent = "Right: " + right + " Wrong: " + wrong;
}

function endGame() {
    //store time left at the game end, because the countdown timer will iterate for 1 more second.
    const ft = tLeft;
    //prevent displaying negative time
    if (tLeft <= 0) {
        tLeft = 0;
    }

    //display time left, replace question with new instructions, stop displaying answer choices, display initials textarea, create a submit button
    theTime.textContent = "Game ended with " + ft;
    currQ.textContent = "Game over! Enter initials below for hi-score table";
    currA.style.display = "none";
    initials.style.display = "inline-block";
    const subBtn = document.querySelector(".playersubmit").appendChild(document.createElement('button'));
    subBtn.textContent = "submit";

    //load previous hi-scores if necessary
    var storedHS = JSON.parse(localStorage.getItem("gameHS"));

    if (storedHS !== null) {
        gameHS = storedHS;
    }

    //on submission, store the new hiscore, then display the highscores, and clear the board of prior instructions, ask user to play again
    subBtn.addEventListener("click", function (event) {
        event.preventDefault();

        var playerHS = {
            player: initials.value.trim(),
            score: right,
            time: ft

        };

        storeHS(playerHS);
        displayHS();
        subBtn.style.display = "none";
        initials.style.display = "none";
        currQ.textContent = "Click the button to play again!";
        sb.textContent = "Play Again";
        sb.disabled = false;
    });
}

var gameHS = [];

//display the hiscore table
function displayHS() {
    tableHS.style.display = "inline-block";

    for (var i = 0; i < gameHS.length; i++) {
        var playerHS = gameHS[i];
        var listHS = tableHS.appendChild(document.createElement('li'));
        listHS.textContent = "Player: " + playerHS.player + " Score: " + playerHS.score + " Time left: " + playerHS.time;
    }

}

function storeHS(x) {
    gameHS.push(x);
    localStorage.setItem("gameHS", JSON.stringify(gameHS));
}

sb.addEventListener("click", begin);

//create question class of objects, each question has a Question, Choices, and an Answer
class question {
    constructor(qQ, qC, qA) {
        this.qQ = qQ;
        this.qC = qC;
        this.qA = qA;
    }
}

//create an empty array, then use map to fill the array with question objects
var quiz = Array.from(new Array(6)).map(() => new question('q', 'c', 0));
//game logic needs to know how many total questions there are
const allQ = quiz.length;

quiz[0].qQ = "In order to link our js to our html, what html tag do we use?";
quiz[0].qC = ["source", "link", "script", "ref"];
quiz[0].qA = 2;

quiz[1].qQ = "In a function, which of the following keywords references the object currently calling the function?";
quiz[1].qC = ["this", "new", "const", "function"];
quiz[1].qA = 0;

quiz[2].qQ = "I want to create a new constant, which declaration should I use?";
quiz[2].qC = ["var", "for", "const", "try...catch"];
quiz[2].qA = 2;

quiz[3].qQ = "A function passed into another function as an argument is called a(n) ___ function";
quiz[3].qC = ["recursive", "callback", "asynchronous", "variable"];
quiz[3].qA = 1;

quiz[4].qQ = "Which of the following is NOT a type of JavaScript scope?";
quiz[4].qC = ["function", "block", "global", "variable"];
quiz[4].qA = 3;

quiz[5].qQ = "Which assignment allows values/properties to be unpacked from arrays/objects?";
quiz[5].qC = ["inheritance", "destructuring", "expression", "syntax"];
quiz[5].qA = 1;




