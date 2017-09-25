// welcome the user
alert("Welcome to Quiz Ninja!");

/*var question = "What is Superman's real name?";
var answer = prompt(question);
alert("You answered " + answer);*/

var quiz = [
    ["What is Superman's real name?", "Clarke Kent"],
    ["What is Wonderwoman's real name?", "Dianna Prince"],
    ["What is Batman's real name?", "Bruce Wayne"]
];


var score = 0; // initialize score

for (var i = 0, max = quiz.length; i < max; i++) {
    var question = quiz[i][0];
    var answer = prompt(question);
    if (answer === quiz[i][1]) {
        alert("good answer");
        score++;
    } else {
        alert("wronk!");
    }
}