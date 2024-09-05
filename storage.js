let extensionId = null;

async function ensureExtensionId() {
  while (!extensionId) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return extensionId;
}

export async function setStorageItem(key, value) {
  const id = await ensureExtensionId();
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(id, {
      action: "setStorageItem",
      key: key,
      value: value
    }, response => {
      if (response && response.status === 'success') {
        resolve(true);
      } else {
        reject(new Error('Failed to set storage item'));
      }
    });
  });
}

export async function getStorageItem(key) {
  const id = await ensureExtensionId();
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(id, {
      action: "getStorageItem",
      key: key
    }, response => {
      if (response && response.status === 'success') {
        resolve(response.value);
      } else {
        reject(new Error('Failed to get storage item'));
      }
    });
  });
}

export async function initMixpanel(token) {
  const id = await ensureExtensionId();
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(id, {
      action: "initMixpanel",
      token: token
    }, response => {
      if (response && response.status === 'Mixpanel initialized') {
        resolve(true);
      } else {
        reject(new Error('Failed to initialize Mixpanel'));
      }
    });
  });
}

export async function trackMixpanelEvent(eventName, properties) {
  const id = await ensureExtensionId();
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(id, {
      action: "trackEvent",
      eventName: eventName,
      properties: properties
    }, response => {
      if (response && response.status === 'Event tracked') {
        resolve(true);
      } else {
        reject(new Error('Failed to track event'));
      }
    });
  });
}

window.addEventListener("message", function(event) {
  if (event.data.type === "SET_EXTENSION_ID") {
    extensionId = event.data.extensionId;
    console.log("Extension ID set in storage.js:", extensionId);
  }
});
