window.state = {
    'score': 0,
    'highscore': 0,
    'quote': null,
    'history': []
};

window.maxHistory = 20;
window.quotePool = [];
window.poolMax = 3;

$(function () { /* Entry Point */
    prefetch();
    $(document).keydown(function(e) {
        if(window.state.quote !== null) {
            if(e.which == 37) {
                $("#option1").click();
            }
            else if(e.which == 39) {
                $("#option2").click();
            }
        }
    });
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

function prefetch() {
    for(var i = 0; i < window.poolMax - window.quotePool.length; i++) {
        fetch(function(data) {
            window.quotePool.push(data);
        });
    }
}

function fetch(callback) {
    getQuote().then(function (data) {
        if (data.quote.length > 250 || data.quote.length < 6) {
            fetch(callback);
        } 
        else {
            callback(data);
        }
    });
}

function loadQuote() {
    if(window.quotePool.length === 0) {
        getQuote().then(function(data) {
            fetch(function(data) {
                setActiveQuote(data);
            })
        });
    }
    else {
        setActiveQuote(window.quotePool.pop());
        prefetch();
    }
}

function setActiveQuote(data) {
    window.state['quote'] = data;
    $("#quote").html(data.quote);
    $("#quote").find("a").contents().unwrap(); // Remove any links
    // Save to history
    if(window.state.history.length > window.maxHistory) {
        // Clear oldest
        window.state.history.shift();
    }
    window.state.history.push(window.state.quote);
    loadOptions(data.correct, data.wrong);
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

function showHistory() {
    updateHistoryUI();
    $("#history-modal").show();
}

function hideHistory() {
    $("#history-modal").hide();
}

function updateHistoryUI() {
    // Render all history items except the last one.
    // The last is the current quote.
    $("#history-list").html(""); // Clear previous
    for(var i = window.state.history.length - 2; i >= 0; i--) {
        $("#history-list").append(renderHistoryItem(window.state.history[i]));
    }
    $("#history-list").find("a").contents().unwrap(); // Remove links 
}

function hideOptions() {
    $("#quote").text("Loading...");
    $("#option1").unbind("click");
    $("#option2").unbind("click");
    $("#options").hide();
}

function renderHistoryItem(data) {
    return (
        "<div class='history-item'>" +
        "<div class='history-item-quote'>" + 
        "<i class='fa fa-quote-left' aria-hidden='true'></i>&nbsp;" +
        data.quote +
        "&nbsp;<i class='fa fa-quote-right' aria-hidden='true'></i>" +  
        "</div><div class='history-item-author'>" +
        data.correct + 
        "</div></div><br>"
    );
}