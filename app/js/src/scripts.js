//// dom references ////
var $question = document.getElementById("question");
var $score = document.getElementById("score");
var $feedback = document.getElementById("feedback");
var $start = document.getElementById("start");
var $form = document.getElementById("answer");
var $timer = document.getElementById("timer");

var quiz = {
    "name": "Super Hero Name Quiz",
    "description": "How many super heroes can you name?",
    "question": "What is the real name of ",
    "questions": [
        {"question": "Superman", "answer": "Clarke Kent"},
        {"question": "Batman", "answer": "Bruce Wayne"},
        {"question": "Wonder Woman", "answer": "Dianna Prince"}
    ]
};

var score = 0; // initialize score

/// view functions ///
function update(element, content, klass) {
    var p = element.firstChild || document.createElement("p"); //firstChild works, because every element in HTM file has been created without any whitespaces inside
    p.textContent = content;
    element.appendChild(p);
    if (klass) {
        p.className = klass;
    }
}

//helper functions
function hide(element) {
    element.style.display = "none";
}

function show(element) {
    element.style.display = "block";
}


// hide the form at the start of the game
hide($form);

//play function
function play(quiz) {

    // hide button and show form
    hide($start);
    show($form);

    // initialize timer and set up an interval that counts down
    var time = 20;
    update($timer, time);
    var interval = window.setInterval(countDown, 1000);

    $form.addEventListener('submit', function (event) {
        event.preventDefault();
        check($form[0].value);
    }, false);

    //functions declarations

    // this is called every second and decreases the time
    function countDown() {
        // decrease time by 1
        time--;
        // update the time displayed
        update($timer, time);
        // the game is over if the timer has reached 0
        if (time <= 0) {
            gameOver();
        }
    }

    function ask(question) {
        update($question, quiz.question + question);
        $form[0].value = "";
        $form[0].focus();
    }

    function check(answer) {
        if (answer === quiz.questions[i].answer) { // quiz[i][1] is the ith answer
            update($feedback, "Correct!", "right");
            // increase score by 1
            score++;
            update($score, score)
        } else {
            update($feedback, "Wrong!", "wrong");
        }

        i++;
        if (i === quiz.questions.length) {
            gameOver();
        } else {
            chooseQuestion();
        }
    }

    function chooseQuestion() {
        var question = quiz.questions[i].question;
        ask(question);
    }

    function gameOver() {
        // inform the player that the game has finished and tell them how many points they have scored
        update($question, "Game Over, you scored " + score + " points");

        hide($form);
        show($start);

        // stop the countdown interval
        window.clearInterval(interval);
    }

    var i = 0;
    chooseQuestion();

}

// Event listeners
$start.addEventListener('click', function () {
    play(quiz);
}, false);

update($score, score);
