import { ipcMain, app, screen } from 'electron'
import { WindowManager } from './window-manager'

export function setupIpcHandlers(windowManager: WindowManager): void {
  // 윈도우 토글 (플로팅 ↔ 모달)
  ipcMain.handle('toggle-window', () => {
    windowManager.toggleWindow()
    return windowManager.getWindowState()
  })

  // 윈도우 상태 조회
  ipcMain.handle('get-window-state', () => {
    return windowManager.getWindowState()
  })

  // 앱 종료
  ipcMain.handle('quit-app', () => {
    app.quit()
  })

  // 윈도우 드래그 시작
  ipcMain.handle('start-drag', () => {
    const win = windowManager.getMainWindow()
    if (win) {
      const pos = win.getPosition()
      return { x: pos[0], y: pos[1] }
    }
    return null
  })

  // 윈도우 이동
  ipcMain.handle('move-window', (_event, deltaX: number, deltaY: number) => {
    const win = windowManager.getMainWindow()
    if (win) {
      const [x, y] = win.getPosition()
      win.setPosition(x + deltaX, y + deltaY)
    }
  })
}
