// background.js
var globalData;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.directories) {
        globalData = message.directories
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getGlobalData') {
        // Send stored data to popup script
        sendResponse({ globalData });
    }
});

