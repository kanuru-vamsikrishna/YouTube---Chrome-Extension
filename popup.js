import { getCurrentTab } from "./utils.js"

const addNewBookmark = (bookmarksElement, bookmark) => {
  const bookmarkTitleElement = document.createElement("div");
  const newBookmarkElement = document.createElement("div");
  const controlsElement = document.createElement("div");

  bookmarkTitleElement.textContent = bookmark.desc;
  bookmarkTitleElement.className = "bookmark-title";

  controlsElement.className = "bookmark-controls";

  newBookmarkElement.id = "bookmark-" + bookmark.time;
  newBookmarkElement.className = "bookmark";
  newBookmarkElement.setAttribute("timestamp", bookmark.time)

  setBookmarkAttributes("play", onPlay, controlsElement);
  setBookmarkAttributes("delete", onDelete, controlsElement);

  newBookmarkElement.appendChild(bookmarkTitleElement)
  newBookmarkElement.appendChild(controlsElement)
  bookmarksElement.appendChild(newBookmarkElement)

};

const viewBookmarks = (currentBookmarks = []) => {
  const bookmarksElement = document.getElementById("bookmarks")
  bookmarksElement.innerHTML = ""

  if (currentBookmarks.length > 0) {
    for (let i = 0; i < currentBookmarks.length; i++) {
      const bookmark = currentBookmarks[i]
      addNewBookmark(bookmarksElement, bookmark)
    }
  } else {
    bookmarksElement.innerHTML = "<i class='row'>No bookmarks to show</i>";
  }
};

const onPlay = async e => {
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const activeTab = await getCurrentTab();

  chrome.tabs.sendMessage(
    activeTab.id,
    {
      type: "PLAY",
      value: bookmarkTime,
    },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error playing timestamp:", chrome.runtime.lastError.message);
      } else if (response && response.status === "success") {
        console.debug("Timestamp played successfully:", response);
      } else {
        console.debug("Unexpected response while playing timestamp:", response);
      }
    }
  );
};

const onDelete = async e => {
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const activeTab = await getCurrentTab();

  const bookmarkElementToDelete = document.getElementById("bookmark-" + bookmarkTime);
  bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete)

  chrome.tabs.sendMessage(
    activeTab.id,
    {
      type: "DELETE",
      value: bookmarkTime,
    },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error deleting timestamp:", chrome.runtime.lastError.message);
      } else if (response && response.status === "success") {
        console.debug("Timestamp deleted successfully:", response);
      } else {
        console.debug("Unexpected response while deleting timestamp:", response);
      }
    }, viewBookmarks
  );
};

const setBookmarkAttributes = (src, eventListener, controlParentElement) => { 
  const controlElement = document.createElement("img")
  controlElement.src = "assets/" + src + ".png"
  controlElement.title = src;
  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement)
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const activeTab = await getCurrentTab();
    const container = document.getElementsByClassName("container")[0];

    if (!container) {
      console.error("Container element not found.");
      return;
    }

    if (activeTab.url.includes("youtube.com/watch")) {
      const queryParameters = activeTab.url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);

      const currentVideo = urlParameters.get("v");
      console.debug(currentVideo, "current");

      if (currentVideo) {
        chrome.storage.sync.get([currentVideo], (data) => {
          const currentVideoBookmarks = data[currentVideo]
            ? JSON.parse(data[currentVideo])
            : [];
            viewBookmarks(currentVideoBookmarks)
        });
      }
    } else {
      container.innerHTML = `
        <div class="title" style="text-align: center">
          This is not a YouTube video page.
        </div>`;
    }
  } catch (error) {
    console.error("Error loading the active tab:", error);
  }
});