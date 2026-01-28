"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  toggleWindow: () => electron.ipcRenderer.invoke("toggle-window"),
  getWindowState: () => electron.ipcRenderer.invoke("get-window-state"),
  quitApp: () => electron.ipcRenderer.invoke("quit-app"),
  startDrag: () => electron.ipcRenderer.invoke("start-drag"),
  moveWindow: (deltaX, deltaY) => electron.ipcRenderer.invoke("move-window", deltaX, deltaY),
  onWindowStateChanged: (callback) => {
    electron.ipcRenderer.on("window-state-changed", (_event, state) => callback(state));
  }
});
