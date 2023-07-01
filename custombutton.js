let button = null; // Variable to hold the reference to the button
var prevHighlightedText = "default";


// Add an event listener for text selection
document.addEventListener("mouseup", handleHighlight);

// Function to handle text selection
function handleHighlight() {
  const selectedText = window.getSelection().toString().trim();

  console.log(prevHighlightedText.valueOf() != selectedText.valueOf());
  if (prevHighlightedText.valueOf() != selectedText.valueOf()) {//if new thing highlighted
    if (button) {
      button.remove(); // Remove the previously created button
    }

    if (selectedText !== "") {//make button
      console.log("highlight detected");
      console.log("Selected text:", selectedText);
      console.log("prev text:", prevHighlightedText);

      setTimeout(() => {
        button = createButton();
        positionButton(button);
        button.addEventListener("click", handlePopup);
        console.log("button eventlistener added");
        document.body.appendChild(button);
      }, 100);

    }
  }
  prevHighlightedText = selectedText;
  chrome.runtime.sendMessage({ text: selectedText });
  console.log("msg sent");
}

// Function to create the "Show Popup" button
function createButton() {
  const button = document.createElement("button");
  button.style.width = "40px";
  button.style.height = "40px";
  button.style.borderRadius = "50%";
  button.style.backgroundColor = "transparent";
  button.style.backgroundImage = "url(icons/logo.jpg)";

  button.style.backgroundSize = "cover";
  button.style.backgroundPosition = "center";
  button.style.backgroundRepeat = "no-repeat";
  return button;
}


function positionButton(button) {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    button.style.position = "absolute";
    button.style.left = rect.right + "px";
    button.style.top = rect.top + window.scrollY + "px";
  }
}// Function to handle the popup window
function handlePopup() {
  // Define the width and height of the popup window
  const popupWidth = 750;
  const popupHeight = 500;
  console.log("handlePopup() has been run.");


  // Assuming you have the button object referenced as "button"
  const buttonRect = button.getBoundingClientRect();
  const buttonX = buttonRect.left;
  const buttonY = buttonRect.top;


  // Open the new window
  const popupWindow = window.open("", "", `width=${popupWidth},height=${popupHeight}`);

  // Set the position of the popup window
  popupWindow.moveTo(buttonX, buttonY);
  popupWindow.resizeTo(popupWidth, popupHeight);

  // Load the content of index.html in the popup window
  popupWindow.document.write(
    `<html><head><title>Popup Window</title></head><body><object type="text/html" data="${chrome.extension.getURL(
      "index.html"
    )}" style="width: 100%; height: 100%;"></object></body></html>`
  );

  // Add an event listener to close the popup when interacting with the webpage outside the popup
  window.addEventListener("click", function (event) {
    if (event.target !== popupWindow && event.target !== button) {
      popupWindow.close();
    }
  });
}


