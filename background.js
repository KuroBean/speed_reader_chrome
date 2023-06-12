// Listen for message from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // Check if message contains selected text
  if (request.text) {
    // Store selected text in extension's storage
    chrome.storage.local.set({ highlightedText: request.text }, function() {
      // Notify content script that text is stored
      sendResponse({ message: 'Text stored' });
    });
    return true; // Keep the messaging channel open for sendResponse
  }
});
