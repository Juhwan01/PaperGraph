import { MessageItem } from './MessageItem'
import type { Message } from '../stores/chatStore'

interface Props {
  messages: Message[]
}

export function MessageList({ messages }: Props) {
  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="message-list__empty">
          <p>논문에 대해 질문해보세요!</p>
          <p className="message-list__hint">
            예: "RAG의 최신 기법은 무엇인가요?"
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))
      )}
    </div>
  )
}
