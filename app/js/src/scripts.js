(function () {
    "use strict"
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
            {"question": "Superman", "answer": "Clarke Kent", "asked": false},
            {"question": "Batman", "answer": "Bruce Wayne", "asked": false},
            {"question": "Wonder Woman", "answer": "Dianna Prince", "asked": false},
            {"question": "Spider Man", "answer": "Peter Parker", "asked": false},
            {"question": "Iron Man", "answer": "Tony Stark", "asked": false},
        ]
    };

    var question; // current question
    var initialScore = 0; // initialize score

    var i = 0; //initialize counter of questions... maybe we can make it so it isn't global variable
/// view functions ///
    function update(element, content, klass) {
        console.trace();
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

//hide the timer
    hide($timer);


//random function

    function random(a, b, callback) {
        if (b === undefined) {
            // if only one argument is supplied, assume the lower limit is 1
            b = a, a = 1;
        }
        var result = Math.floor((b - a + 1) * Math.random()) + a;
        if (typeof callback === "function") {
            result = callback(result);
        }
        return result;
    }

//play function
    function Game(quiz) {
        //first lets set some properties
        this.questions = quiz.questions;
        this.phrase = quiz.question;
        this.score = 0;//initialize score
        update($score, this.score); //and make it visible

        // initialize timer and set up an interval that counts down
        this.time = 20;
        update($timer, this.time);
        this.interval = window.setInterval(this.countDown.bind(this), 1000);

        // hide button, and show form and feedback and timer, besides, feedback needs to be cleared.
        hide($start);
        show($form);
        show($timer);
        $feedback.innerHTML = "";
        show($feedback);

        // add event listener to form for when it's submitted. If an object is passed as 2nd parameter, then 'handleEvent' property is searched for, and called if its function
        $form.addEventListener('click', this, false);

        this.chooseQuestion();
    }

    //here we fumble in the Game.prototype
    Game.prototype.chooseQuestion = function () {
        console.log("chooseQuestion() invoked");
        var questions = this.questions.filter(function (question) {
            return question.asked === false;
        });

        // set the current question
        this.question = questions[random(questions.length) - 1];
        this.ask(this.question);
    };

    Game.prototype.ask = function (question) {
        console.log("ask() invoked");

        var quiz = this;

        // set the question.asked property to true so it's not asked again
        question.asked = true;
        update($question, this.phrase + question.question + '?');

        //NOW CLEAR THE FUCKING FORM, YO...
        $form.innerHTML = "";

        // create an array to put the different options in and a button variable
        var options = [], button;
        var option1 = chooseOption();
        options.push(option1.answer);
        var option2 = chooseOption();
        options.push(option2.answer);
        // add the actual answer at a random place in the options array
        options.splice(random(0, 2), 0, question.answer);

        // loop through each option and display it as a button
        options.forEach(function (name) {
            button = document.createElement("button");
            button.value = name;
            button.textContent = name;
            $form.appendChild(button);
        });

        // choose an option from all the possible answers but without choosing the same option twice. We have to choose one of the objects randomly, to find proposition for answer that lays within.
        function chooseOption() {
            var option = quiz.questions[random(quiz.questions.length) - 1];
            // check to see if the option chosen is the current question or already one of the options, if it is then recursively call this function until it isn't
            if (option === question || options.indexOf(option.answer) !== -1) {
                return chooseOption();
            }
            return option;
        }
    };

    Game.prototype.check = function (answer) {
        console.log("check() invoked");
        //ternaries
        answer === this.question.answer ? (
                update($feedback, "Correct!", "right"),
                    // increase score by 1
                    this.score++,
                    update($score, this.score))
            : (
                update($feedback, "Wrong!", "wrong")
            );
        i++;
        //now how the hell do I check if thats last answer?
        (i === quiz.questions.length) ? (
            this.gameOver()
        ) : (
            this.chooseQuestion()
        )
    };

    Game.prototype.countDown = function () {
        // decrease time by 1
        this.time--;
        // update the time displayed
        update($timer, this.time);
        // the game is over if the timer has reached 0
        if (this.time <= 0) {
            this.gameOver();
        }
    };

    //
    Game.prototype.onClickFireCheck = function (e) {
        this.check(e.target.value);
    };

    //Game has to have handleEvent property. It is searched automatically. Game is object, and objects have properties.
    Game.prototype.handleEvent = function(event) {
        if (event.type === "click") {
            //this.onClickFireCheck(event);
            this.check(event.target.value); //button.value
        }
    };

    Game.prototype.gameOver = function(){
        console.log("gameOver() invoked");
        // inform the player that the game has finished and tell them how many points they have scored
        update($question, "Game Over, you scored " + this.score + " points");

        hide($form);
        hide($timer);
        show($start);

        // stop the countdown interval
        window.clearInterval(this.interval);

        //reset questions counter
        i = 0;

        this.questions.forEach(function (question) {
            question.asked = false;
        });

        //remove event listener from $form
        $form.removeEventListener('click', this, false);
    };



// Event listeners
    $start.addEventListener('click', function () {
        new Game(quiz);
    }, false);

    update($score, initialScore);

    //stop the automatic refresh of page when the form is submitted.
    $form.addEventListener("submit", function (e) {
        e.preventDefault();
    }, false);

}());

