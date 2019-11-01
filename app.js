var focus = document.getElementById('focus'); //focus text box
var breakT = document.getElementById('break'); // break text box
var submit = document.getElementById('submit'); // start button
var reset = document.getElementById('reset'); // reset button
var activity = document.getElementById('activity'); // activity text box

var bodyPomodoro = document.getElementById('bodyPomodoro'); //body

var isActive = false; //toggle active
var stopAll = false; //stopping timer

var currentPomodoro = document.getElementById('currentPomodoro'); //current pomodoro div

//check if theres a cookie first
//if(cookie) then get all cookie and use those information
//else start new
bodyPomodoro.onload = async () => {
    if (getCookie('activity')) {
        var eTime = new Date(getCookie('endTime'));
        isActive = true;

        disableAll();

        activity.value = getCookie('activity');
        focus.value = getCookie('focusTime');
        breakT.value = getCookie('breakTime');

        currentPomodoro.innerHTML =
            '<h3> Activity : ' + getCookie('activity') + '</h3>' +
            '<h3> Start time : ' + new Date(getCookie('startTime')).toLocaleTimeString() + '</h3>' +
            '<h3> End time : ' + new Date(getCookie('endTime')).toLocaleTimeString() + '</h3>' +
            '<h3> Focus Duration : ' + getCookie('focusTime') + " Minutes" + '</h3>' +
            '<h3> Break Duration : ' + getCookie('breakTime') + " Minutes" + '</h3>';

        //Creating the cancel button
        var cancelButton = document.createElement("button");
        var cancelText = document.createTextNode("Cancel");
        cancelButton.setAttribute('id', 'cancelPomodoro');
        cancelButton.setAttribute('type', 'button');
        cancelButton.appendChild(cancelText);

        document.getElementById('cancel').appendChild(cancelButton);


        // Set the date we're counting down to
        var countDownDate = new Date(eTime).getTime();
        var countDownDateBreak = new Date(eTime.setSeconds(eTime.getSeconds() + parseInt(breakT.value))).getTime();

        stopAll = false;
        await focusCountdown('focus', countDownDate);
        await focusCountdown('break', countDownDateBreak);
    }
};
//add focus minutes
document.getElementById('plusFocus').addEventListener("click", () => {
    focus.value = (parseInt(focus.value) + 1);
})
//minus focus minutes
document.getElementById('minusFocus').addEventListener("click", () => {
    if (parseInt(focus.value) > 25) {
        focus.value = (parseInt(focus.value) - 1);
    }
})
//add break minutes
document.getElementById('plusBreak').addEventListener("click", () => {
    breakT.value = (parseInt(breakT.value) + 1);
})
//minus break minutes
document.getElementById('minusBreak').addEventListener("click", () => {
    if (parseInt(breakT.value) > 5) {
        breakT.value = (parseInt(breakT.value) - 1);
    }
})

submit.addEventListener('click', async () => {
    if (activity.value && isActive === false) {
        var sTime = new Date();
        var eTime = new Date();
        isActive = true;

        disableAll();

        //for minutes
        //eTime.setMinutes(eTime.getMinutes() + parseInt(focus.value));

        //for seconds ( FOR TESTING )
        eTime.setSeconds(eTime.getSeconds() + parseInt(focus.value));

        //setting cookies
        document.cookie = "activity=" + activity.value;
        document.cookie = "focusTime=" + focus.value;
        document.cookie = "breakTime=" + breakT.value;
        document.cookie = "startTime=" + sTime;
        document.cookie = "endTime=" + eTime;

        //setting info
        currentPomodoro.innerHTML =
            '<h3> Activity : ' + activity.value + '</h3>' +
            '<h3> Start time : ' + sTime.toLocaleTimeString() + '</h3>' +
            '<h3> End time : ' + eTime.toLocaleTimeString() + '</h3>' +
            '<h3> Focus Duration : ' + focus.value + " Minutes" + '</h3>' +
            '<h3> Break Duration : ' + breakT.value + " Minutes" + '</h3>';

        //Creating the cancel button
        var cancelButton = document.createElement("button");
        var cancelText = document.createTextNode("Cancel");
        cancelButton.setAttribute('id', 'cancelPomodoro');
        cancelButton.setAttribute('type', 'button');
        cancelButton.appendChild(cancelText);

        document.getElementById('cancel').appendChild(cancelButton);


        // Set the date we're counting down to
        var countDownDate = new Date(eTime).getTime();
        var countDownDateBreak = new Date(eTime.setSeconds(eTime.getSeconds() + parseInt(breakT.value))).getTime();

        stopAll = false;
        await focusCountdown('focus', countDownDate);
        await focusCountdown('break', countDownDateBreak);

    } else {
        if (activity.value !== "") {
            alert("there's an ongoing activity that is not done yet!");
        } else {
            alert('please enter activity first before starting');
        }
    }
});


reset.addEventListener('click', () => {
    if (!isActive) {
        activity.value = "";
        focus.value = "25";
        breakT.value = "5";
        enableAll();
    } else {
        alert("there's an ongoing activity that is not done yet!");
    }
});

document.addEventListener('click', function (e) {
    //dynamic cancel button event
    if (e.target && e.target.id == 'cancelPomodoro') {
        enableAll();
        isActive = false;
        stopAll = true;
        removeElement('cancelPomodoro');
        deleteAllCookies()
    }
});



function disableAll() {
    activity.setAttribute('readonly', 'true')
    document.getElementById('plusFocus').setAttribute('disabled', 'true');
    document.getElementById('minusFocus').setAttribute('disabled', 'true');
    document.getElementById('plusBreak').setAttribute('disabled', 'true');
    document.getElementById('minusBreak').setAttribute('disabled', 'true');
    submit.setAttribute('disabled', 'true');
    reset.setAttribute('disabled', 'true');
}
function enableAll() {
    activity.removeAttribute('readonly')
    document.getElementById('plusFocus').removeAttribute('disabled');
    document.getElementById('minusFocus').removeAttribute('disabled');
    document.getElementById('plusBreak').removeAttribute('disabled');
    document.getElementById('minusBreak').removeAttribute('disabled');
    submit.removeAttribute('disabled');;
    reset.removeAttribute('disabled');;
}


//COUNTDOWN
function focusCountdown(timer, cd) {
    return new Promise((resolve, reject) => {

        var x = setInterval(function () {
            // Get today's date and time
            var now = new Date().getTime();
            // Find the distance between now and the count down date
            var distance = cd - now;

            // Time calculations for days, hours, minutes and seconds
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Output the result in an element with id="countdown"
            if (timer === "focus") {
                document.getElementById("countdown").innerHTML = "<h1> Focus Time Countdown : " + hours + "H "
                    + minutes + "M " + seconds + "S </h1>";
            } else if (timer === "break") {
                document.getElementById("countdown").innerHTML = "<h1> Break Time Countdown : " + hours + "H "
                    + minutes + "M " + seconds + "S </h1>";
            }


            // If the count down is over, write some text 
            if (distance < 0 || stopAll) {
                if (stopAll) {
                    document.getElementById("countdown").innerHTML = "<h1> Cancelled! </h1>";
                    isActive = false;
                    enableAll();
                    clearInterval(x);
                    resolve();
                } else {
                    if (timer === 'focus') {
                        document.getElementById("countdown").innerHTML = "<h1> Going to break... </h1>";
                    } else {
                        document.getElementById("countdown").innerHTML = "<h1> Well Done!!! Keep it up! </h1>";
                        removeElement('cancelPomodoro');
                        stopAll = false;
                        isActive = false;
                        enableAll();
                        deleteAllCookies();
                    }
                }
                clearInterval(x);
                resolve();
            }
        }, 1000);
    });
}

function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}

//getting cookies information
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie(cname) {
    document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function deleteAllCookies() {
    deleteCookie('activity');
    deleteCookie('focusTime');
    deleteCookie('breakTime');
    deleteCookie('startTime');
    deleteCookie('endTime');
}