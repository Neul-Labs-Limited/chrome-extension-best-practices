# Chrome Extension Best Practices (Manifest v3)

## Overview

This repository contains a sample Chrome extension demonstrating best practices for Manifest V3 extensions. It showcases key concepts and techniques for building robust and efficient Chrome extensions, with a focus on:

1. Communication between background scripts and content scripts
2. Secure handling of the extension ID
3. Integration with third-party services (e.g., Mixpanel) without using their standard SDK
4. Efficient storage management across extension components

## Repository Structure

```
chrome-extension-best-practices/
├── src/
│   ├── background.js
│   ├── content.js
│   ├── storage.js
│   └── styles.css
├── manifest.json
├── package.json
├── webpack.config.js
├── README.md
└── icons/
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

## Key Features

1. Secure communication between background and content scripts
2. Dynamic injection of the extension ID into content scripts
3. Integration with Mixpanel using its HTTP API instead of the JavaScript SDK
4. Centralized storage management
5. Modular code structure for better maintainability

## Setup and Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/chrome-extension-best-practices.git
   ```

2. Navigate to the project directory:
   ```
   cd chrome-extension-best-practices
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Build the extension:
   ```
   npm run build
   ```

5. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the `dist` directory in your project folder

## Usage

After installation, the extension will be active on all web pages. It demonstrates:

- Tracking page views using Mixpanel
- Storing and retrieving the last visit timestamp

To see it in action:

1. Open the Chrome Developer Tools (F12 or Ctrl+Shift+I)
2. Navigate to the "Console" tab
3. You should see logs indicating:
   - The extension ID being set
   - Mixpanel initialization
   - Page view events being tracked
   - Storage operations

## Core Concepts Demonstrated

### 1. Extension ID Communication

The background script injects the extension ID into content scripts, allowing for secure communication between different parts of the extension.

```javascript
// In background.js
function injectExtensionId(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: setExtensionId,
    args: [chrome.runtime.id]
  });
}
```

### 2. Content Script to Background Script Communication

Content scripts use the injected extension ID to communicate with the background script.

```javascript
// In storage.js
chrome.runtime.sendMessage(extensionId, {
  action: "setStorageItem",
  key: key,
  value: value
}, response => {
  // Handle response
});
```

### 3. Mixpanel Integration without SDK

The extension demonstrates how to integrate Mixpanel using its HTTP API instead of the JavaScript SDK.

```javascript
// In background.js
async function trackMixpanelEvent(eventName, properties) {
  // Implementation using fetch to send events to Mixpanel
}
```

### 4. Centralized Storage Management

A dedicated `storage.js` module handles all storage operations, providing a clean interface for other parts of the extension.

```javascript
// In storage.js
export async function setStorageItem(key, value) {
  // Implementation
}

export async function getStorageItem(key) {
  // Implementation
}
```

## Best Practices

1. **Security**: Use the extension ID for message passing to ensure that only your extension can communicate with its components.

2. **Modularity**: Separate concerns into different files (e.g., `background.js`, `content.js`, `storage.js`) for better organization and maintainability.

3. **Asynchronous Operations**: Use async/await for cleaner asynchronous code, especially for storage and API operations.

4. **Error Handling**: Implement proper error handling and logging throughout the extension.

5. **Performance**: Minimize the use of storage and API calls by batching operations where possible.

6. **Privacy**: Be mindful of the data you collect and store. Only track necessary information and comply with privacy regulations.

7. **Manifest V3 Compliance**: Ensure all APIs and practices are compatible with Manifest V3 specifications.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Author

Dipankar Sarkar

---

For any questions or suggestions, please open an issue or contact the author directly.
