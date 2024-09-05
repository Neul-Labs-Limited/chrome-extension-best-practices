let MIXPANEL_TOKEN;
let DISTINCT_ID = 'anon-' + Math.random().toString(36).substr(2, 9);

function initMixpanel(token) {
  MIXPANEL_TOKEN = token;
  console.log('Mixpanel initialized with token:', token);
}

async function trackMixpanelEvent(eventName, properties) {
  if (!MIXPANEL_TOKEN || !DISTINCT_ID) {
    console.log('Mixpanel not fully initialized. Event not tracked:', eventName, properties);
    return;
  }

  const eventData = {
    event: eventName,
    properties: {
      token: MIXPANEL_TOKEN,
      time: Math.floor(Date.now() / 1000),
      distinct_id: DISTINCT_ID,
      $insert_id: `${DISTINCT_ID}-${Date.now()}`,
      ...properties
    }
  };

  try {
    const response = await fetch('https://api.mixpanel.com/track', {
      method: 'POST',
      headers: {
        'Accept': 'text/plain',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([eventData]),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    console.log('Event tracked:', eventName);
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

function setStorageItem(key, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

function getStorageItem(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[key]);
      }
    });
  });
}

chrome.runtime.onExternalMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "initMixpanel") {
    initMixpanel(message.token);
    sendResponse({status: 'Mixpanel initialized'});
  } else if (message.action === "trackEvent") {
    trackMixpanelEvent(message.eventName, message.properties);
    sendResponse({status: 'Event tracked'});
  } else if (message.action === "setStorageItem") {
    setStorageItem(message.key, message.value)
      .then(() => sendResponse({status: 'success'}))
      .catch((error) => sendResponse({status: 'error', message: error.message}));
    return true;
  } else if (message.action === "getStorageItem") {
    getStorageItem(message.key)
      .then((value) => sendResponse({status: 'success', value: value}))
      .catch((error) => sendResponse({status: 'error', message: error.message}));
    return true;
  }
});

function injectExtensionId(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: setExtensionId,
    args: [chrome.runtime.id]
  });
}

function setExtensionId(extensionId) {
  window.postMessage({ type: "SET_EXTENSION_ID", extensionId: extensionId }, "*");
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    injectExtensionId(tabId);
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({}, (tabs) => {
    for (let tab of tabs) {
      injectExtensionId(tab.id);
    }
  });
});

console.log('Background script loaded');
