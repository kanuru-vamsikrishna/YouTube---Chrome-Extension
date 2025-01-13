(() => {
  let youtubeLeftControls, youtubePlayer;
  let currentVideo = "";
  let currentVideoBookmarks = []

  if (window.hasRun) {
    return;
  }
  window.hasRun = true;
  console.log(window, "window");

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
      const { type, value, videoId } = obj;

      if (type === "NEW") {
        currentVideo = videoId
        console.log('123');
        newVideoLoaded()
      }
    })

  const newVideoLoaded = () => {
    const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0]
    console.log(bookmarkBtnExists, "bookmarkBtnExists")
    if (!bookmarkBtnExists) {
      const bookmarkBtn = document.createElement("img")
      bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
      bookmarkBtn.className = "ytp-button" + "bookmark-btn";
      bookmarkBtn.title = "Click to bookmark current timestamp";

      youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0]
      youtubePlayer = document.getElementsByClassName("video-stream")[0]

      youtubeLeftControls.appendChild(bookmarkBtn);
      bookmarkBtn.addEventListener("click", addNewBookmark)
    }
  }

  const addNewBookmark = () => {
    const currentTime = youtubePlayer.currentTime;
    const newBookmark = {
      time: currentTime,
      desc: "Bookmark at " + getTime(currentTime)
    }
    console.log(newBookmark, "newBookmark")
    chrome.storage.sync.set({
      [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a - b))
    })
  }

})()

const getTime = (time) => {
  let date = new Date(0);
  date.setSeconds(time)
  return date.toISOString().substring(11, 8)
}