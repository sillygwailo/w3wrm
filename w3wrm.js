var Wordnik = require('wordnik');
var r = require('requestretry');
var c = require(__dirname + '/config.js');

var w = new Wordnik({
  api_key: c.wordnikKey
});

var randomOptions = {
  minDictionaryCount: 20,
  includePartOfSpeech: 'noun',
  excludePartOfSpeech: "proper-noun,proper-noun-plural,proper-noun-posessive,suffix,family-name,idiom,affix",
  hasDictionaryDef: true,
  maxLength: 12,
  minCorpusCount: 10000,
  limit: 3,
}

// Capitalize the word http://stackoverflow.com/a/17752917/300278
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

var words_array = [];

function w3wRetryStrategy(err, response){
  // retry the request if we had an error or if the response was a 'Bad Gateway'
  return JSON.parse(response.body).error;
}

w.randomWords(randomOptions, function(err, words) {
  words.forEach(function(element) {
    words_array.push(element.word);
  })
  words_string = words_array.join('.');
  r({
    url: 'http://api.what3words.com/w3w?key=' + c.w3wKey + '&string=' + words_string,
    method: 'POST',
    retryStrategy: w3wRetryStrategy
  }, function (err, res, body) {
    words = JSON.parse(body).words;
    words_string = words_array.join('.');
    words = words_array;
    var capitalizedWords = [];
    words.forEach(function(word) {
      capitalizedWords.push(capitalize(word));
    });
    console.log(capitalizedWords.join(' '));
      position = JSON.parse(body).position;
      if (typeof(position) !== 'undefined') {
        console.log('https://maps.googleapis.com/maps/api/staticmap?zoom=5&size=440x220&maptype=satelite&center=' + position.join(',') + '&markers=color:blue%7C' + position.join(',') + '&label:S&sensor=true');
    }
    res.end = function() { console.log("Program ended"); }
  })
});