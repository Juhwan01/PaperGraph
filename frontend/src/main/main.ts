import { app, BrowserWindow, globalShortcut } from 'electron'
import { setupIpcHandlers } from './ipc-handlers'
import { WindowManager } from './window-manager'

// Windows 투명 윈도우를 위한 설정
app.commandLine.appendSwitch('disable-gpu-compositing')
app.commandLine.appendSwitch('enable-transparent-visuals')
app.disableHardwareAcceleration()

let windowManager: WindowManager

async function createWindow(): Promise<void> {
  windowManager = new WindowManager()
  await windowManager.createMainWindow()
  setupIpcHandlers(windowManager)
}

app.whenReady().then(async () => {
  // 투명 윈도우를 위해 약간의 딜레이
  setTimeout(async () => {
    await createWindow()

    // 글로벌 단축키 (Ctrl+Shift+P)
    globalShortcut.register('CommandOrControl+Shift+P', () => {
      windowManager.toggleWindow()
    })
  }, 100)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
