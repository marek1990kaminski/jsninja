//// dom references ////
var $question = document.getElementById("question");
var $score = document.getElementById("score");
var $feedback = document.getElementById("feedback");
var $start = document.getElementById("start");
var $form = document.getElementById("answer");

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
    var p = element.firstChild || document.createElement("p");
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

    $form.addEventListener('submit', function (event) {
        event.preventDefault();
        check($form[0].value);
    }, false);

    //functions declarations
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
    }

    var i = 0;
    chooseQuestion();

}

// Event listeners
$start.addEventListener('click', function () {
    play(quiz);
}, false);

update($score, score);
