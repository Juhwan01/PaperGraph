"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const electron = require("electron");
const path = require("path");
function setupIpcHandlers(windowManager2) {
  electron.ipcMain.handle("toggle-window", () => {
    windowManager2.toggleWindow();
    return windowManager2.getWindowState();
  });
  electron.ipcMain.handle("get-window-state", () => {
    return windowManager2.getWindowState();
  });
  electron.ipcMain.handle("quit-app", () => {
    electron.app.quit();
  });
  electron.ipcMain.handle("start-drag", () => {
    const win = windowManager2.getMainWindow();
    if (win) {
      const pos = win.getPosition();
      return { x: pos[0], y: pos[1] };
    }
    return null;
  });
  electron.ipcMain.handle("move-window", (_event, deltaX, deltaY) => {
    const win = windowManager2.getMainWindow();
    if (win) {
      const [x, y] = win.getPosition();
      win.setPosition(x + deltaX, y + deltaY);
    }
  });
}
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const FLOATING_SIZE = 64;
const MODAL_WIDTH = 480;
const MODAL_HEIGHT = 640;
class WindowManager {
  constructor() {
    __publicField(this, "mainWindow", null);
    __publicField(this, "windowState", "floating");
  }
  async createMainWindow() {
    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
    this.mainWindow = new electron.BrowserWindow({
      width: FLOATING_SIZE,
      height: FLOATING_SIZE,
      x: width - FLOATING_SIZE - 30,
      y: height - FLOATING_SIZE - 120,
      frame: false,
      transparent: true,
      backgroundColor: "#00000000",
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      hasShadow: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js")
      }
    });
    this.mainWindow.setVisibleOnAllWorkspaces(true);
    this.mainWindow.setAlwaysOnTop(true, "screen-saver");
    this.mainWindow.on("blur", () => {
      if (this.mainWindow) {
        this.mainWindow.setAlwaysOnTop(true, "screen-saver");
      }
    });
    this.setCircleShape();
    if (VITE_DEV_SERVER_URL) {
      await this.mainWindow.loadURL(VITE_DEV_SERVER_URL);
    } else {
      await this.mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
    }
    return this.mainWindow;
  }
  // 원형 윈도우 모양 설정
  setCircleShape() {
    if (!this.mainWindow) return;
    const rects = [];
    const cx = FLOATING_SIZE / 2;
    const cy = FLOATING_SIZE / 2;
    const r = FLOATING_SIZE / 2;
    for (let y = 0; y < FLOATING_SIZE; y++) {
      const dy = y - cy + 0.5;
      const dx = Math.sqrt(r * r - dy * dy);
      if (!isNaN(dx)) {
        const x1 = Math.floor(cx - dx);
        const x2 = Math.ceil(cx + dx);
        rects.push({ x: x1, y, width: x2 - x1, height: 1 });
      }
    }
    this.mainWindow.setShape(rects);
  }
  // 사각형 윈도우 모양 (모달용)
  clearShape() {
    if (!this.mainWindow) return;
    this.mainWindow.setShape([]);
  }
  toggleWindow() {
    if (!this.mainWindow) return;
    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
    if (this.windowState === "floating") {
      this.clearShape();
      const x = Math.round((width - MODAL_WIDTH) / 2);
      const y = Math.round((height - MODAL_HEIGHT) / 2);
      this.mainWindow.setBounds({
        x,
        y,
        width: MODAL_WIDTH,
        height: MODAL_HEIGHT
      });
      this.mainWindow.setResizable(true);
      this.mainWindow.setAlwaysOnTop(true, "screen-saver");
      this.windowState = "expanded";
    } else {
      this.mainWindow.setBounds({
        x: width - FLOATING_SIZE - 30,
        y: height - FLOATING_SIZE - 120,
        width: FLOATING_SIZE,
        height: FLOATING_SIZE
      });
      this.mainWindow.setResizable(false);
      this.mainWindow.setAlwaysOnTop(true, "screen-saver");
      this.windowState = "floating";
      setTimeout(() => this.setCircleShape(), 50);
    }
    this.mainWindow.webContents.send("window-state-changed", this.windowState);
  }
  getMainWindow() {
    return this.mainWindow;
  }
  getWindowState() {
    return this.windowState;
  }
}
electron.app.commandLine.appendSwitch("disable-gpu-compositing");
electron.app.commandLine.appendSwitch("enable-transparent-visuals");
electron.app.disableHardwareAcceleration();
let windowManager;
async function createWindow() {
  windowManager = new WindowManager();
  await windowManager.createMainWindow();
  setupIpcHandlers(windowManager);
}
electron.app.whenReady().then(async () => {
  setTimeout(async () => {
    await createWindow();
    electron.globalShortcut.register("CommandOrControl+Shift+P", () => {
      windowManager.toggleWindow();
    });
  }, 100);
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("will-quit", () => {
  electron.globalShortcut.unregisterAll();
});
