// JavaScript code
var words = [];
var index = 0;
var cumulativeText = "";
var timeoutId;
var pauseKeys = [".", ",", ";", ":", ")", "]"];
var pauseTimeForKeys = 300;
var regularPauseTime = 150;
var timeInterval;
var timeIncPerChar = 20; // Adjust this value to control the time increment per character
var timeUpperCap=500;
var timeLowerCap=75;

//PUT DOCUMENT EVENT LISTENERS HERE, NOT AT BOTTOM
document.addEventListener('DOMContentLoaded', function () {
  // Your code to set the inputText value here
  // Retrieve stored text from extension's storage
  chrome.storage.local.get(['highlightedText'], function (result) {
    console.log("getting stored text");
    var inputText = document.getElementById('inputText');
    inputText.value = result.highlightedText || '';
  });
});
//document.addEventListener("mouseup", handleSelection);

//document.addEventListener("click",function(){console.log("beans")});

function handleSelection() {
  console.log("highlighting detected")
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
  var lastSyllable = getLastSyllable(word);
  var formattedWord = "";

  if (countVowels(word) === 1) {
    formattedWord = "<b>" + firstSyllable + "</b>" + word.substr(firstSyllable.length);
  } else {
    formattedWord = "<b>" + firstSyllable + "</b>" + word.substr(firstSyllable.length, word.length - firstSyllable.length - lastSyllable.length) + "<b>" + lastSyllable + "</b>";
  }

  var outputDiv = document.getElementById("output");
  var cumulativeOutputDiv = document.getElementById("cumulativeOutput");

  // Get the user-inputted font size for the flashing text
  var outputFontSize = document.getElementById("outputFontSize").value;

  // Apply the font size to the output div
  outputDiv.style.fontSize = outputFontSize + "px";
  cumulativeOutputDiv.style.fontSize = 18 + "px";

  outputDiv.innerHTML = formattedWord;
  cumulativeText += formattedWord + " ";
  cumulativeOutputDiv.innerHTML = cumulativeText;

  index++;

  var wordLength = word.length;
  var timeAdjustment = (wordLength - 5) * timeIncPerChar;

  if (pauseKeys.includes(word.charAt(word.length - 1))) {
    timeInterval = pauseTimeForKeys;
    //length adjustment doesn't kick in for already longer pausing words with pausekeys
  } else {
    timeInterval = regularPauseTime + timeAdjustment;
  }

  // Cap the timeInterval between 50ms and 400ms
  if (timeInterval > timeUpperCap) {
    timeInterval = timeUpperCap;
  } else if (timeInterval < timeLowerCap) {
    timeInterval = timeLowerCap;
  }

  timeoutId = setTimeout(displayNextWord, timeInterval);
}

// Rest of the code remains the same


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

function getLastSyllable(word) {
  var vowels = ["a", "e", "i", "o", "u", "y"];
  var lastSyllable = "";

  var lastIndex = -1;

  for (var i = 0; i < word.length; i++) {
    if (vowels.includes(word[i])) {
      lastIndex = i;
    }
  }

  if (lastIndex > -1) {
    lastSyllable = word.substr(lastIndex);
  }

  return lastSyllable;
}

function countVowels(word) {
  var vowels = ["a", "e", "i", "o", "u", "y"];
  var count = 0;

  for (var i = 0; i < word.length; i++) {
    if (vowels.includes(word[i])) {
      count++;
    }
  }

  return count;
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

//BC OF NULL ERROR, ANYTHING BELOW HERE IS DEADZONE UNTIL POPUP IS OPENED
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

