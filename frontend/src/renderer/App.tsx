import { useEffect, useState } from 'react'
import { FloatingButton } from './components/FloatingButton'
import { Modal } from './components/Modal'

export type WindowState = 'floating' | 'expanded'

function App() {
  const [windowState, setWindowState] = useState<WindowState>('floating')

  useEffect(() => {
    // 초기 상태 가져오기
    window.electronAPI?.getWindowState().then((state) => {
      setWindowState(state as WindowState)
    })

    // 상태 변경 이벤트 리스너
    window.electronAPI?.onWindowStateChanged((state) => {
      setWindowState(state as WindowState)
    })
  }, [])

  const handleToggle = () => {
    window.electronAPI?.toggleWindow()
  }

  return (
    <div className={`app app--${windowState}`}>
      {windowState === 'floating' ? (
        <FloatingButton onClick={handleToggle} />
      ) : (
        <Modal onMinimize={handleToggle} />
      )}
    </div>
  )
}

export default App
