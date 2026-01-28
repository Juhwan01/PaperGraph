import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  toggleWindow: () => ipcRenderer.invoke('toggle-window'),
  getWindowState: () => ipcRenderer.invoke('get-window-state'),
  quitApp: () => ipcRenderer.invoke('quit-app'),
  startDrag: () => ipcRenderer.invoke('start-drag'),
  moveWindow: (deltaX: number, deltaY: number) => ipcRenderer.invoke('move-window', deltaX, deltaY),
  onWindowStateChanged: (callback: (state: string) => void) => {
    ipcRenderer.on('window-state-changed', (_event, state) => callback(state))
  },
})

export interface ElectronAPI {
  toggleWindow: () => Promise<string>
  getWindowState: () => Promise<string>
  quitApp: () => Promise<void>
  startDrag: () => Promise<{ x: number; y: number } | null>
  moveWindow: (deltaX: number, deltaY: number) => Promise<void>
  onWindowStateChanged: (callback: (state: string) => void) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
