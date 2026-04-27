const { contextBridge, ipcRenderer } = require('electron');

// We expose everything to the React app under window.crackDesktopAPI
contextBridge.exposeInMainWorld('crackDesktopAPI', {
  // Screen capturing APIs
  getCaptureSources: (options) => ipcRenderer.invoke('bridge:get-capture-sources', options),
  
  // Security toggle API
  toggleContentProtection: (enable) => ipcRenderer.invoke('toggle-content-protection', enable),
  
  // Window Settings API
  setOpacity: (opacity) => ipcRenderer.invoke('window:setOpacity', opacity),
  setAlwaysOnTop: (alwaysOnTop) => ipcRenderer.invoke('window:setAlwaysOnTop', alwaysOnTop),
  setSkipTaskbar: (skip) => ipcRenderer.invoke('window:setSkipTaskbar', skip),
  setIgnoreMouseEvents: (ignore) => ipcRenderer.invoke('window:setIgnoreMouseEvents', ignore),
  
  // Listeners for Global Hotkeys
  onToggleAutoMode: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('copilot-toggle-auto-mode', handler);
    // Return a cleanup function for React useEffect
    return () => ipcRenderer.removeListener('copilot-toggle-auto-mode', handler);
  },
  onTriggerInstantResponse: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('copilot-trigger-instant-response', handler);
    // Return a cleanup function for React useEffect
    return () => ipcRenderer.removeListener('copilot-trigger-instant-response', handler);
  }
});
