export async function getCurrentTab() {
  console.log("Utils.js script loaded");
  try {
    let queryOptions = { active: true, currentWindow: true };
    console.log(queryOptions, "queryOptions")
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab, "tab");
    return tab;
  } catch (error) {
    console.error("Error fetching the current tab:", error);
    return null;
  }
}
