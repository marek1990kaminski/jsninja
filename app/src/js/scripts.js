(function () {
    "use strict"

    var view = (function () {

        /// view functions ///
        function update(element, content, klass) {
            console.trace();
            var p = element.firstChild || document.createElement("p");          //firstChild works, because every element in HTM file has been created without any whitespaces inside
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

        return {
            question: document.getElementById("question"),
            score: document.getElementById("score"),
            feedback: document.getElementById("feedback"),
            start: document.getElementById("start"),
            form: document.getElementById("answer"),
            timer: document.getElementById("timer"),
            hiscore: document.getElementById("hiScore"),
            update: update,
            hide: hide,
            show: show
        }
    }());

    // gets the question JSON file using Ajax
    function getQuiz() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var quiz = JSON.parse(xhr.responseText);
                console.log("response type: " + xhr.responseType);
                console.log("response " + xhr.response);
                new Game(quiz);
            }
        };
        xhr.open("GET", "https://s3.amazonaws.com/sitepoint-book-content/jsninja/quiz.json", true);
        xhr.overrideMimeType("application/json");
        xhr.send();
        view.update(view.question, "Waiting for questions...");
    }


    var initialScore = 0; // initialize score

    var i = 0; //initialize counter of questions... maybe we can make it so it isn't global variable


// hide the form at the start of the game
    view.hide(view.form);

//hide the timer
    view.hide(view.timer);


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

//Game function/constructor/class
    function Game(quiz) {
        //first lets set some properties
        this.questions = quiz.questions;
        this.phrase = quiz.question;
        this.score = 0;//initialize score
        view.update(view.score, this.score); //and make it visible

        // initialize timer and set up an interval that counts down
        this.time = 20;
        view.update(view.timer, this.time);
        this.interval = window.setInterval(this.countDown.bind(this), 1000);

        // hide button, and show form and feedback and timer, besides, feedback needs to be cleared.
        view.hide(view.start);
        view.show(view.form);
        view.show(view.timer);
        view.feedback.innerHTML = "";
        view.show(view.feedback);

        // add event listener to form for when it's submitted. If an object is passed as 2nd parameter, then 'handleEvent' property is searched for, and called if its function
        view.form.addEventListener('click', this, false);

        this.chooseQuestion();
    }

    //Score storage using localStorage
    Game.prototype.hiScore = function () {
        if (window.localStorage) {
            // the value held in localStorage is initally null so make it 0
            var hi = localStorage.getItem("hiScore") || 0;
            // check if the hi-score has been beaten and display a messageif it has
            if (this.score > hi || hi === 0) {
                if (this.score > hi) {
                    window.alert("ey b0ss, you just beaten the high score with your " + this.score + " scores!");
                }
                localStorage.setItem("hiScore", this.score);
            }
            return localStorage.getItem("hiScore");
        }
    };

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
        view.update(view.question, this.phrase + question.question + '?');

        //NOW CLEAR THE FORM, YO...
        view.form.innerHTML = "";

        // create an array to put the different possible answers in and a button element
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
            view.form.appendChild(button);
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
                view.update(view.feedback, "Correct!", "right"),
                    // increase score by 1
                    this.score++,
                    view.update(view.score, this.score))
            : (
                view.update(view.feedback, "Wrong!", "wrong")
            );
        i++;
        //now how the hell do I check if thats last answer?
        (i === this.questions.length) ? (
            this.gameOver()
        ) : (
            this.chooseQuestion()
        )
    };

    Game.prototype.countDown = function () {
        // decrease time by 1
        this.time--;
        // update the time displayed
        view.update(view.timer, this.time);
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
    Game.prototype.handleEvent = function (event) {
        if (event.type === "click") {
            //this.onClickFireCheck(event);
            this.check(event.target.value); //button.value
        }
    };

    Game.prototype.gameOver = function () {
        console.log("gameOver() invoked");
        // inform the player that the game has finished and tell them how many points they have scored
        view.update(view.question, "Game Over, you scored " + this.score + " points");

        view.hide(view.form);
        view.hide(view.timer);
        view.show(view.start);

        // stop the countdown interval
        window.clearInterval(this.interval);

        //reset questions counter
        i = 0;

        this.questions.forEach(function (question) {
            question.asked = false;
        });

        //remove event listener from $form
        view.form.removeEventListener('click', this, false);

        view.hiscore.innerText = "for now the higest score = " + this.hiScore();

    };


// Event listeners
    view.start.addEventListener('click', getQuiz, false);

    view.update(view.score, initialScore);

    //stop the automatic refresh of page when the form is submitted.
    view.form.addEventListener("submit", function (e) {
        e.preventDefault();
    }, false);

}());

