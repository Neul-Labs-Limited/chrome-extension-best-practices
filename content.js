import { setStorageItem, getStorageItem, initMixpanel, trackMixpanelEvent } from './storage.js';

let extensionId = null;

window.addEventListener("message", function(event) {
  if (event.data.type === "SET_EXTENSION_ID") {
    extensionId = event.data.extensionId;
    console.log("Extension ID set:", extensionId);
  }
});

async function ensureExtensionId() {
  while (!extensionId) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return extensionId;
}

document.addEventListener('DOMContentLoaded', async () => {
  await ensureExtensionId();
  
  // Initialize Mixpanel (replace 'YOUR_MIXPANEL_TOKEN' with an actual token)
  await initMixpanel('YOUR_MIXPANEL_TOKEN');
  
  // Example: Track page view
  await trackMixpanelEvent('Page View', { url: window.location.href });
  
  // Example: Set and get a storage item
  await setStorageItem('lastVisit', new Date().toISOString());
  const lastVisit = await getStorageItem('lastVisit');
  console.log('Last visit:', lastVisit);
});

// Add your content script logic here
