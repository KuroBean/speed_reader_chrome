// JavaScript code
var words = [];
var index = 0;
var cumulativeText = "";
var timeoutId;
var pauseKeys = [".", ",", ";", ":"];
var pauseTimeForKeys = 300;
var regularPauseTime = 150;
var timeInterval;
document.addEventListener('DOMContentLoaded', function() {
  // Your code to set the inputText value here
// Retrieve stored text from extension's storage
chrome.storage.local.get(['highlightedText'], function(result) {
  console.log("getting stored text");
  var inputText = document.getElementById('inputText');
  inputText.value = result.highlightedText || '';
});
});


function handleSelection() { 
  var selectedText = window.getSelection().toString(); 
  if (selectedText.length > 0) {
    console.log("Selected text:", selectedText); 
    chrome.runtime.sendMessage({ text: selectedText }); 
    console.log("msg sent");
  } 
}

function displayWordsWithBoldSyllables() {
  var inputText = document.getElementById("inputText").value;
  words = inputText.split(" ");
  index = 0;
  cumulativeText = "";

  var outputDiv = document.getElementById("output");
  var cumulativeOutputDiv = document.getElementById("cumulativeOutput");
  outputDiv.innerHTML = "";
  cumulativeOutputDiv.innerHTML = "";

  clearTimeout(timeoutId);

  displayNextWord();
}

function displayNextWord() {
  if (index >= words.length) {
    return;
  }

  var word = words[index];
  var firstSyllable = getFirstSyllable(word);
  var boldSyllable = "<b>" + firstSyllable + "</b>";
  var remainingLetters = word.substr(firstSyllable.length);
  var formattedWord = boldSyllable + remainingLetters;

  var outputDiv = document.getElementById("output");
  var cumulativeOutputDiv = document.getElementById("cumulativeOutput");

   // Get the user-inputted font size for the flashing text
  var outputFontSize = document.getElementById("outputFontSize").value;

  // Apply the font size to the output div
  outputDiv.style.fontSize = outputFontSize + "px";
  
  outputDiv.innerHTML = formattedWord;
  cumulativeText += formattedWord + " ";
  cumulativeOutputDiv.innerHTML = cumulativeText;

  index++;

  if (pauseKeys.includes(word.charAt(word.length - 1))) {
    timeInterval = pauseTimeForKeys;
  } else {
    timeInterval = regularPauseTime;
  }

  timeoutId = setTimeout(displayNextWord, timeInterval);
}

function getFirstSyllable(word) {
  var vowels = ["a", "e", "i", "o", "u", "y"];
  var firstSyllable = "";

  for (var i = 0; i < word.length; i++) {
    if (vowels.includes(word[i])) {
      firstSyllable = word.substr(0, i + 1);
      break;
    }
  }

  return firstSyllable;
}

function pauseAnimation() {
  clearTimeout(timeoutId);
}

function resumeAnimation() {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(displayNextWord, timeInterval);
}

function toggleDarkMode() {
  var darkModeCheckbox = document.getElementById("darkModeCheckbox");
  var styleSheet = document.getElementById("styleSheet");
  var darkModeStyleSheet = document.getElementById("darkModeStyleSheet");

  if (darkModeCheckbox.checked) {
    styleSheet.disabled = true;
    darkModeStyleSheet.disabled = false;
  } else {
    styleSheet.disabled = false;
    darkModeStyleSheet.disabled = true;
  }
}

var playButton = document.getElementById("playButton");
playButton.addEventListener("click", displayWordsWithBoldSyllables);

var pauseButton = document.getElementById("pauseButton");
pauseButton.addEventListener("click", pauseAnimation);

var resumeButton = document.getElementById("resumeButton");
resumeButton.addEventListener("click", resumeAnimation);

var darkModeCheckbox = document.getElementById("darkModeCheckbox");
darkModeCheckbox.addEventListener("change", toggleDarkMode);

var pauseTimeInput = document.getElementById("pauseTime");
pauseTimeInput.addEventListener("input", function () {
  pauseTimeForKeys = parseInt(pauseTimeInput.value) || 300;
});

var regularPauseTimeInput = document.getElementById("regularPauseTime");
regularPauseTimeInput.addEventListener("input", function () {
  regularPauseTime = parseInt(regularPauseTimeInput.value) || 150;
});
document.addEventListener("mouseup", handleSelection); 