import { useState } from 'react'
import { UploadTab } from './UploadTab'
import { ChatTab } from './ChatTab'

interface Props {
  onMinimize: () => void
}

type Tab = 'upload' | 'chat'

export function Modal({ onMinimize }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('upload')

  const handleQuit = () => {
    window.electronAPI?.quitApp()
  }

  return (
    <div className="modal">
      {/* 헤더 - 드래그 가능 영역 */}
      <header className="modal__header">
        <div className="modal__logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span>PaperGraph</span>
        </div>

        {/* 윈도우 컨트롤 버튼들 */}
        <div className="modal__controls">
          {/* 최소화 버튼 (플로팅으로 돌아가기) */}
          <button className="modal__btn modal__btn--minimize" onClick={onMinimize} title="최소화">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          {/* 닫기 버튼 (앱 종료) */}
          <button className="modal__btn modal__btn--close" onClick={handleQuit} title="종료">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <nav className="modal__tabs">
        <button
          className={`modal__tab ${activeTab === 'upload' ? 'modal__tab--active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          논문 업로드
        </button>
        <button
          className={`modal__tab ${activeTab === 'chat' ? 'modal__tab--active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          AI 채팅
        </button>
      </nav>

      {/* 컨텐츠 */}
      <main className="modal__content">
        {activeTab === 'upload' ? <UploadTab /> : <ChatTab />}
      </main>
    </div>
  )
}
