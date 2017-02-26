
var authors = ["Douglas Adams", "Dante Alighieri", "Aristotle", "Buddha", "Confucius", "Charles Darwin", "Charles Dickens", "Albert Einstein", "T. S. Eliot", "Ralph Waldo Emerson", "Richard Feynman", "Mahatma Gandhi", "Jesus", "John Keats", "Helen Keller", "John F. Kennedy", "Martin Luther King, Jr.", "Laozi", "Timothy Leary", "Muhammad", "Thomas Paine", "Eleanor Roosevelt", "Bertrand Russell", "William Saroyan", "William Shakespeare", "George Bernard Shaw", "Percy Bysshe Shelley", "Starhawk", "Leo Tolstoy", "Virgil", "Voltaire", "Anonymous"];

function getQuote() {
    return new Promise(function(resolve, reject) {
        var correctAuthor = randomInt(0, authors.length);
        WikiquoteApi.getRandomQuote(authors[correctAuthor], function(result) {
            var wrongAuthor;
            do {
                wrongAuthor = randomInt(0, authors.length);
            } while (wrongAuthor === correctAuthor);
            data = {
                quote: result.quote,
                correct: result.titles,
                wrong: authors[wrongAuthor]
            }
            resolve(data);
        }, function (e) {
            console.log("Error");
            reject(e);
        });
    });
}

function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}