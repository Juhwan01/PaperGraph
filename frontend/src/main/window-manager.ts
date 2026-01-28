import { BrowserWindow, screen } from 'electron'
import path from 'path'

export type WindowState = 'floating' | 'expanded'

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

// 플로팅 버튼 크기
const FLOATING_SIZE = 64
// 모달 창 크기
const MODAL_WIDTH = 480
const MODAL_HEIGHT = 640

export class WindowManager {
  private mainWindow: BrowserWindow | null = null
  private windowState: WindowState = 'floating'

  async createMainWindow(): Promise<BrowserWindow> {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize

    this.mainWindow = new BrowserWindow({
      width: FLOATING_SIZE,
      height: FLOATING_SIZE,
      x: width - FLOATING_SIZE - 30,
      y: height - FLOATING_SIZE - 120,
      frame: false,
      transparent: true,
      backgroundColor: '#00000000',
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      hasShadow: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
    })

    this.mainWindow.setVisibleOnAllWorkspaces(true)
    // Windows에서는 'screen-saver' 레벨이 가장 높은 우선순위
    this.mainWindow.setAlwaysOnTop(true, 'screen-saver')

    // 포커스를 잃어도 항상 맨 위에 유지
    this.mainWindow.on('blur', () => {
      if (this.mainWindow) {
        this.mainWindow.setAlwaysOnTop(true, 'screen-saver')
      }
    })

    // 플로팅 상태에서 원형 마스크 적용
    this.setCircleShape()

    if (VITE_DEV_SERVER_URL) {
      await this.mainWindow.loadURL(VITE_DEV_SERVER_URL)
    } else {
      await this.mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    }

    return this.mainWindow
  }

  // 원형 윈도우 모양 설정
  private setCircleShape(): void {
    if (!this.mainWindow) return

    // 원형 영역 생성 (여러 개의 작은 사각형으로 원 근사)
    const rects: Electron.Rectangle[] = []
    const cx = FLOATING_SIZE / 2
    const cy = FLOATING_SIZE / 2
    const r = FLOATING_SIZE / 2

    for (let y = 0; y < FLOATING_SIZE; y++) {
      const dy = y - cy + 0.5
      const dx = Math.sqrt(r * r - dy * dy)
      if (!isNaN(dx)) {
        const x1 = Math.floor(cx - dx)
        const x2 = Math.ceil(cx + dx)
        rects.push({ x: x1, y, width: x2 - x1, height: 1 })
      }
    }

    this.mainWindow.setShape(rects)
  }

  // 사각형 윈도우 모양 (모달용)
  private clearShape(): void {
    if (!this.mainWindow) return
    this.mainWindow.setShape([])
  }

  toggleWindow(): void {
    if (!this.mainWindow) return

    const { width, height } = screen.getPrimaryDisplay().workAreaSize

    if (this.windowState === 'floating') {
      // 플로팅 → 모달 확장
      this.clearShape() // 원형 마스크 제거

      const x = Math.round((width - MODAL_WIDTH) / 2)
      const y = Math.round((height - MODAL_HEIGHT) / 2)

      this.mainWindow.setBounds({
        x,
        y,
        width: MODAL_WIDTH,
        height: MODAL_HEIGHT,
      })
      this.mainWindow.setResizable(true)
      this.mainWindow.setAlwaysOnTop(true, 'screen-saver')
      this.windowState = 'expanded'
    } else {
      // 모달 → 플로팅 최소화
      this.mainWindow.setBounds({
        x: width - FLOATING_SIZE - 30,
        y: height - FLOATING_SIZE - 120,
        width: FLOATING_SIZE,
        height: FLOATING_SIZE,
      })
      this.mainWindow.setResizable(false)
      this.mainWindow.setAlwaysOnTop(true, 'screen-saver')
      this.windowState = 'floating'

      // 원형 마스크 다시 적용
      setTimeout(() => this.setCircleShape(), 50)
    }

    this.mainWindow.webContents.send('window-state-changed', this.windowState)
  }

  getMainWindow(): BrowserWindow | null {
    return this.mainWindow
  }

  getWindowState(): WindowState {
    return this.windowState
  }
}
