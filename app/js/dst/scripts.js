!function(){"use strict";function e(e,n,t){console.trace();var o=e.firstChild||document.createElement("p");o.textContent=n,e.appendChild(o),t&&(o.className=t)}function n(e){e.style.display="none"}function t(e){e.style.display="block"}function o(e,n,t){void 0===n&&(n=e,e=1);var o=Math.floor((n-e+1)*Math.random())+e;return"function"==typeof t&&(o=t(o)),o}function a(a){function m(n){function t(){var e=a.questions[o(a.questions.length)-1];return e===n||-1!==i.indexOf(e.answer)?t():e}console.log("ask() invoked"),n.asked=!0,e(s,a.question+n.question+"?");var r,i=[],u=t();i.push(u.answer);var c=t();i.push(c.answer),i.splice(o(0,2),0,n.answer),i.forEach(function(e){(r=document.createElement("button")).value=e,r.textContent=e,d.appendChild(r)})}function k(n){console.log("check() invoked"),n===r.answer?(e(u,"Correct!","right"),e(i,++f)):e(u,"Wrong!","wrong"),v++,g()}function g(){console.log("chooseQuestion() invoked");var e=a.questions.filter(function(e){return!1===e.asked});d.innerHTML="",m(r=e[o(e.length)-1])}function p(){console.log("gameOver() invoked"),e(s,"Game Over, you scored "+f+" points"),n(d),t(c),window.clearInterval(h),v=0}n(c),u.innerHTML="",t(d),t(u),t(l);var w=20;e(l,w);var h=window.setInterval(function(){e(l,--w),w<=0&&p()},1e3);d.addEventListener("click",function(e){k(e.target.value)},!1),g()}var r,s=document.getElementById("question"),i=document.getElementById("score"),u=document.getElementById("feedback"),c=document.getElementById("start"),d=document.getElementById("answer"),l=document.getElementById("timer"),m={name:"Super Hero Name Quiz",description:"How many super heroes can you name?",question:"What is the real name of ",questions:[{question:"Superman",answer:"Clarke Kent",asked:!1},{question:"Batman",answer:"Bruce Wayne",asked:!1},{question:"Wonder Woman",answer:"Dianna Prince",asked:!1},{question:"Spider Man",answer:"Peter Parker",asked:!1},{question:"Iron Man",answer:"Tony Stark",asked:!1}]},f=0,v=0;n(d),n(l),c.addEventListener("click",function(){a(m)},!1),e(i,f)}();