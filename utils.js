export async function getCurrentTab() {
  try {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab, "tab");
    return tab;
  } catch (error) {
    console.error("Error fetching the current tab:", error);
    return null;
  }
}
