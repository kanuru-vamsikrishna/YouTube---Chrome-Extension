chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Ensure the tab URL includes "youtube.com/watch"
  if (changeInfo.status === "complete" && tab.url && tab.url.includes("youtube.com/watch")) {
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    // Send a message to the content script
    chrome.tabs.sendMessage(
      tabId,
      {
        type: "NEW",
        videoId: urlParameters.get("v"),
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Content script not ready", chrome.runtime.lastError.message);
        }
      }
    );
  }
});