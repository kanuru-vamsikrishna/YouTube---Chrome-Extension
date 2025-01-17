(() => {
  let youtubeLeftControls, youtubePlayer;
  let currentVideo = "";
  let currentVideoBookmarks = [];

  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  console.log(window, "window");

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId } = obj;

    if (type === "NEW") {
      currentVideo = videoId;
      console.log("123");
      newVideoLoaded();
    }
  });

  const fetchAllBookmarks = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get([currentVideo], (obj) => {
        resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : [])
      })
    })
  }

  const newVideoLoaded = async () => {
    youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
    youtubePlayer = document.getElementsByClassName("video-stream")[0];

    // Ensure youtubeLeftControls exists before proceeding
    if (!youtubeLeftControls) {
      console.log("youtubeLeftControls not found");
      return;
    }

    currentVideoBookmarks = await fetchAllBookmarks();

    // Check if the bookmark button already exists
    const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
    if (!bookmarkBtnExists) {
      const bookmarkBtn = document.createElement("img");
      bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
      bookmarkBtn.className = "ytp-button bookmark-btn";
      bookmarkBtn.title = "Click to bookmark current timestamp";

      youtubeLeftControls.appendChild(bookmarkBtn);
      bookmarkBtn.addEventListener("click", addNewBookmark);
    } else {
      console.log("Bookmark button already exists");
    }
  };

  const addNewBookmark = async () => {
    const currentTime = youtubePlayer.currentTime;
    const newBookmark = {
      time: currentTime,
      desc: "Bookmark at " + getTime(currentTime),
    };
    console.log(newBookmark, "newBookmark");
    currentVideoBookmarks = await fetchAllBookmarks();

    chrome.storage.sync.set({
      [currentVideo]: JSON.stringify(
        [...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)
      ),
    });
  };

  const getTime = (time) => {
    let date = new Date(0);
    date.setSeconds(time);
    return date.toISOString().substring(11, 19);
  };
  console.log("Content script loaded on", window.location.href);
})();
