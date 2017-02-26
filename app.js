window.state = {
    'score': 0,
    'highscore': 0,
    'quote': null
};

$(function () { /* Entry Point */
    if(localStorage.highscore) {
        window.state['highscore'] = localStorage.highscore;
    }
    else {
        localStorage.highscore = 0;
    }
    updateScoreUI();
    hideOptions();
    loadQuote();
});

function loadQuote() {
    getQuote().then(function(data) {
        if(data.quote.length > 250 || data.quote.length === 0) {
            loadQuote();
        }
        else {
            window.state['quote'] = data;
            $("#quote").html(data.quote);
            $("#quote").find("a").contents().unwrap(); // Remove any links
            if($("#quote").html().length === 0) {
                loadQuote();
            }
            else {
                loadOptions(data.correct, data.wrong);
            }
        }
    });
}

function loadOptions(correct, wrong) {
    var correctBtn, wrongBtn;
    if(Math.random() > 0.5) {
        correctBtn = $("#option1");
        wrongBtn = $("#option2");
    }
    else {
        correctBtn = $("#option2");
        wrongBtn = $("#option1");
    }
    correctBtn.html(correct);
    correctBtn.unbind("click").click(function() {
        correctHandler();
    });

    wrongBtn.html(wrong);
    wrongBtn.unbind("click").click(function() {
        wrongHandler();
    });

    $("#options").show();
}

function correctHandler() {
    increaseScore();
    postHandler();
}

function wrongHandler() {
    eraseScore();
    postHandler();
}

function postHandler() {
    hideOptions();
    loadQuote();
}

function eraseScore() {
    window.state.score = 0;
    updateScoreUI();
}

function increaseScore() {
    window.state.score += 1;
    if(window.state.score > window.state.highscore) {
        setHighScore(window.state.score);
    }
    updateScoreUI();
}

function setHighScore(newValue) {
    window.state.highscore = newValue;
    localStorage.highscore = newValue;
}

function updateScoreUI() {
    $("#score").text(window.state.score);
    $("#highscore").text(window.state.highscore);
}

function hideOptions() {
    $("#quote").text("Loading...");
    $("#options").hide();
}