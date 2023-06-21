let button = null; // Variable to hold the reference to the button

// Add an event listener for text selection
document.addEventListener("mouseup", handleHighlight);

// Function to handle text selection
function handleHighlight() {
  const selectedText = window.getSelection().toString().trim();

  // Check if any text is selected
  if (selectedText !== "") {
    if (button) {
      button.remove(); // Remove the previously created button
    }
    button = createButton();
    positionButton(button);
    button.addEventListener("click", handlePopup());
    document.body.appendChild(button);
  }
}

// Function to create the "Show Popup" button
function createButton() {
  const button = document.createElement("button");
  button.textContent = "Show Popup";
  return button;
}

// Function to position the button next to the highlighted text
function positionButton(button) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  button.style.position = "absolute";
  button.style.left = rect.right + "px";
  button.style.top = rect.top + window.pageYOffset + "px";
}

// Create a function to handle the popup
function handlePopup() {
    console.log('handlePopup() has been run.');

    // Remove the button
    //removeButton();

    // Open a new window
    const popupWindow = window.open('', '', 'width=500,height=500');

    // Get the position of the selected text
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Calculate the position for the popup window
    const popupLeft = rect.left + scrollLeft;
    const popupTop = rect.top + scrollTop - 500;

    // Set the position of the popup window
    popupWindow.moveTo(popupLeft, popupTop);
    popupWindow.resizeTo(500, 500);

    // Load the content of index.html in the popup window
    popupWindow.document.write('<html><head><title>Popup Window</title></head><body></body></html>');
    const popupDocument = popupWindow.document.querySelector('body');
    popupDocument.innerHTML = `<object type="text/html" data="${chrome.extension.getURL('index.html')}" style="width: 100%; height: 100%;"></object>`;

    // Add event listener to close the popup when interacting with the webpage outside the popup
    window.addEventListener('click', function (event) {
        if (event.target !== popupWindow && event.target !== button) {
            popupWindow.close();
        }
    });
}
