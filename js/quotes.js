(function () {
    'use strict';

    var quotes = [
        'The cost of refactoring a bad design is cheaper than the cost of living with it.',
        'Refactoring is an act of improving the structure of a code without modifying its behaviors.',
        'The Code comment for machine and your comment for Human'
    ];

    function getRandomQuote() {
        return quotes[Math.floor(Math.random() * quotes.length)];
    }

    window.GeeSuthQuotes = {
        render: function (selector) {
            var el = document.querySelector(selector);
            if (!el) {
                return;
            }
            el.textContent = '“' + getRandomQuote() + '”';
        }
    };
})();
