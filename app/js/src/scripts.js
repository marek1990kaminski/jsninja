(function () {
    "use strict";
//// dom references ////

    var $question = document.getElementById("question");
    var $score = document.getElementById("score");
    var $feedback = document.getElementById("feedback");
    var $start = document.getElementById("start");
    var $form = document.getElementById("answer");
    var $timer = document.getElementById("timer");


    $form.addEventListener("submit", function (e) {
        e.preventDefault();
    });

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
    var score = 0; // initialize score

    var i = 0; //initialize counter
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
    function play(quiz) {

        // hide button, and show form and feedback and timer, besides, feedback needs to be cleared.
        hide($start);
        $feedback.innerHTML = "";
        show($form);
        show($feedback);
        show($timer);


        //reset score
        score = 0;
        update($score, score);

        // initialize timer and set up an interval that counts down
        var time = 20;
        update($timer, time);
        var interval = window.setInterval(countDown, 1000);

        // add event listener to form for when it's submitted
        function listenCheck(e) {
            check(e.target.value);
        }


        $form.addEventListener('click', listenCheck, false);

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
            console.log("ask() invoked");
            // set the question.asked property to true so it's not asked again
            question.asked = true;
            update($question, quiz.question + question.question + '?');
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

            // choose an option from all the possible answers but without choosing the same option twice
            function chooseOption() {
                var option = quiz.questions[random(quiz.questions.length) - 1];
                // check to see if the option chosen is the current question or already one of the options, if it is then recursively call this function until it isn't
                if (option === question || options.indexOf(option.answer) !== -1) {
                    return chooseOption();
                }
                return option;
            }
        }

        function check(answer) {
            console.log("check() invoked");

            if (answer === question.answer) {
                update($feedback, "Correct!", "right");
                // increase score by 1
                score++;
                update($score, score)
            } else {
                update($feedback, "Wrong!", "wrong");
            }
            i++;
            //now how the hell do i check if thats last answer?
            if (i === quiz.questions.length) {
                gameOver();
            } else {
                chooseQuestion();
            }
        }

        function chooseQuestion() {
            console.log("chooseQuestion() invoked");
            var questions = quiz.questions.filter(function (question) {
                return question.asked === false;
            });

            //NOW CLEAR THE FUCKING FORM, YO...
            $form.innerHTML = "";
            // set the current question
            question = questions[random(questions.length) - 1];
            ask(question);
        }

        function gameOver() {
            console.log("gameOver() invoked");
            // inform the player that the game has finished and tell them how many points they have scored
            update($question, "Game Over, you scored " + score + " points");

            hide($form);
            hide($timer);
            show($start);

            // stop the countdown interval
            window.clearInterval(interval);

            //reset questions counter
            i = 0;

            quiz.questions.forEach(function (question) {
                question.asked = false;
            });

            //remove event listener from $form
            $form.removeEventListener("click", listenCheck, false);
        }

        chooseQuestion();

    }

// Event listeners
    $start.addEventListener('click', function () {
        play(quiz);
    }, false);

    update($score, score);


}());