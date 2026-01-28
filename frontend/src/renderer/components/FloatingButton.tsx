import { useRef, useCallback } from 'react'

interface Props {
  onClick: () => void
}

export function FloatingButton({ onClick }: Props) {
  const isDragging = useRef(false)
  const hasMoved = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true
    hasMoved.current = false
    startPos.current = { x: e.screenX, y: e.screenY }

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current) return

      const deltaX = moveEvent.screenX - startPos.current.x
      const deltaY = moveEvent.screenY - startPos.current.y

      // 5px 이상 이동했으면 드래그로 간주
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        hasMoved.current = true
        window.electronAPI?.moveWindow(deltaX, deltaY)
        startPos.current = { x: moveEvent.screenX, y: moveEvent.screenY }
      }
    }

    const handleMouseUp = () => {
      isDragging.current = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)

      // 드래그하지 않았으면 클릭으로 처리
      if (!hasMoved.current) {
        onClick()
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [onClick])

  return (
    <div className="floating-button" onMouseDown={handleMouseDown}>
      <div className="floating-button__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <div className="floating-button__glow" />
    </div>
  )
}
