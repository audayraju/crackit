const { app, BrowserWindow, ipcMain, desktopCapturer, globalShortcut } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    skipTaskbar: false, // Set to false so you can find the window!
    type: 'utility',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    transparent: true,
    frame: false,
  });

  // If packaged (production), load the remote Firebase URL.
  // Otherwise, load localhost for development.
  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    // Production Firebase URL
    mainWindow.loadURL('https://crackit-c11df.web.app');
  }

  // Anti-Analysis & Stealth: Hide this window from screen recorders (like OBS)
  // This matches Verve AI's `mainWindow.setContentProtection(true)`
  if (process.platform === 'darwin' || process.platform === 'win32') {
    mainWindow.setContentProtection(true);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  // Register Global Shortcuts (similar to Verve's CmdOrCtrl+M, CmdOrCtrl+K)
  globalShortcut.register('CommandOrControl+M', () => {
    if (mainWindow) {
      mainWindow.webContents.send('copilot-toggle-auto-mode');
    }
  });

  globalShortcut.register('CommandOrControl+K', () => {
    if (mainWindow) {
      mainWindow.webContents.send('copilot-trigger-instant-response');
    }
  });

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// IPC Screen Capture Handlers
// This is exactly how Verve intercepts screens under the hood
ipcMain.handle('bridge:get-capture-sources', async (_e, opts = {}) => {
  // Grab high resolution thumbnails so we can use them as actual screenshots without a video stream element
  const fetchOpts = {
    types: ['window', 'screen'],
    thumbnailSize: { width: 1920, height: 1080 },
    ...opts
  };
  const rawSources = await desktopCapturer.getSources(fetchOpts);
  return rawSources.map(src => ({
    id: src.id,
    name: src.name,
    display_id: src.display_id,
    appIcon: src.appIcon ? src.appIcon.toDataURL() : null,
    thumbnail: src.thumbnail.toDataURL(), // Base64 of the screenshot!
  }));
});

// Dynamic toggle for content protection from the React frontend
ipcMain.handle('toggle-content-protection', (_e, enable) => {
  if (mainWindow) {
    mainWindow.setContentProtection(enable);
    return { success: true, enabled: enable };
  }
  return { success: false };
});

// Opacity Slider handler
ipcMain.handle('window:setOpacity', (_e, opacity) => {
  if (mainWindow) {
    mainWindow.setOpacity(Number(opacity));
    return { success: true };
  }
  return { success: false };
});

// Always On Top handler
ipcMain.handle('window:setAlwaysOnTop', (_e, alwaysOnTop) => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(Boolean(alwaysOnTop));
    return { success: true };
  }
  return { success: false };
});

// Hide from Taskbar handler
ipcMain.handle('window:setSkipTaskbar', (_e, skipTaskbar) => {
  if (mainWindow) {
    mainWindow.setSkipTaskbar(Boolean(skipTaskbar));
    return { success: true };
  }
  return { success: false };
});

// Click-Through Mode handler
ipcMain.handle('window:setIgnoreMouseEvents', (_e, ignore) => {
  if (mainWindow) {
    // Keep it true but forward mouse events, allowing drag over opaque parts
    mainWindow.setIgnoreMouseEvents(Boolean(ignore), { forward: true });
    return { success: true };
  }
  return { success: false };
});
