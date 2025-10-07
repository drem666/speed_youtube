// background.js

chrome.runtime.onInstalled.addListener(() => {
  console.log("Speed YouTube extension installed.");
});

chrome.runtime.onStartup.addListener(() => {
  console.log("Speed YouTube extension started.");
});
