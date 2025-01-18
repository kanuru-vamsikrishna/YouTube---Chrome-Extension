chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.includes("youtube.com/watch")) {
    console.debug("Sending message to content script for tab:", tabId);

    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    chrome.tabs.sendMessage(
      tabId,
      {
        type: "NEW",
        videoId: urlParameters.get("v"),
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError.message);
        } else if (response && response.status === "success") {
          console.debug("Content script handled message successfully:", response);
        } else {
          console.debug("Unexpected response from content script:", response);
        }
      }
    );  
  }
});
