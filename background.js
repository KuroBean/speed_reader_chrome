chrome.runtime.onMessage.addListener(function (message, sender) {
    if (message.highlightedText) {
      chrome.storage.local.set({ highlightedText: message.highlightedText }, function () {
        chrome.runtime.openOptionsPage();
      });
    }
  });
  