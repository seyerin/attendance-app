const { contextBridge, ipcRenderer } = require('electron');

console.log('preload.js loaded');

contextBridge.exposeInMainWorld('electron', {
  closeApp: () => ipcRenderer.send('close-app')
});
