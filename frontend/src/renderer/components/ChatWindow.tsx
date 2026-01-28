import { MessageList } from './MessageList'
import { InputBox } from './InputBox'
import { useChatStore } from '../stores/chatStore'

export function ChatWindow() {
  const { messages, isLoading } = useChatStore()

  return (
    <div className="chat-window">
      <MessageList messages={messages} />
      {isLoading && (
        <div className="chat-window__loading">
          <span>답변 생성 중...</span>
        </div>
      )}
      <InputBox />
    </div>
  )
}
