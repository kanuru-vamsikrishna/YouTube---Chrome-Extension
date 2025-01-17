import { getCurrentTab } from "./utils"

const addNewBookmark = () => {};

const viewBookmarks = () => {};

const onPlay = e => {};

const onDelete = e => {};

const setBookmarkAttributes =  () => {};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const activeTab = await getCurrentTab();
    console.log(activeTab, "activeTab");
    const container = document.getElementsByClassName("container")[0];

    if (!container) {
      console.error("Container element not found.");
      return;
    }

    if (activeTab.url.includes("youtube.com/watch")) {
      const queryParameters = activeTab.url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);

      const currentVideo = urlParameters.get("v");
      console.log(currentVideo, "current");

      if (currentVideo) {
        chrome.storage.sync.get([currentVideo], (data) => {
          const currentVideoBookmarks = data[currentVideo]
            ? JSON.parse(data[currentVideo])
            : [];
          console.log(currentVideoBookmarks, "Bookmarks for current video");
          // Optionally, render bookmarks here
        });
      }
    } else {
      console.log("Not a YouTube video page.");
      container.innerHTML = `
        <div class="title" style="text-align: center; font-size: 1.2rem; color: #555; margin-top: 20px;">
          This is not a YouTube video page.
        </div>`;
    }
  } catch (error) {
    console.error("Error loading the active tab:", error);
  }
});