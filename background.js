let activeTabStartTime = null;
let currentTabUrl = null;

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  handleTabChange(tab.url);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === "complete") {
    handleTabChange(tab.url);
  }
});

function handleTabChange(url) {
  const now = Date.now();

  if (currentTabUrl && activeTabStartTime) {
    const timeSpent = (now - activeTabStartTime) / 1000; // in seconds
    saveTime(currentTabUrl, timeSpent);
  }

  currentTabUrl = url;
  activeTabStartTime = now;
}

function saveTime(url, time) {
  chrome.storage.local.get(["usage"], (result) => {
    const usage = result.usage || {};
    usage[url] = (usage[url] || 0) + time;
    chrome.storage.local.set({ usage });
  });
}
