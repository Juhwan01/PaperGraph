import { useEffect } from 'react'
import { ChatWindow } from './ChatWindow'
import { useChatStore } from '../stores/chatStore'

export function SidePanel() {
  const { panelState, setPanelState } = useChatStore()

  useEffect(() => {
    // Electron에서 패널 상태 변경 이벤트 수신
    window.electronAPI?.onPanelStateChanged((state) => {
      setPanelState(state as 'collapsed' | 'expanded' | 'fullscreen')
    })
  }, [setPanelState])

  const handleToggle = async () => {
    await window.electronAPI?.togglePanel()
  }

  const handleExpand = async () => {
    await window.electronAPI?.expandFullscreen()
  }

  return (
    <div className={`side-panel side-panel--${panelState}`}>
      <header className="side-panel__header">
        <h1 className="side-panel__title">PaperGraph</h1>
        <div className="side-panel__controls">
          <button onClick={handleExpand} title="전체화면">
            ⛶
          </button>
          <button onClick={handleToggle} title="닫기">
            ✕
          </button>
        </div>
      </header>

      <main className="side-panel__content">
        <ChatWindow />
      </main>
    </div>
  )
}
