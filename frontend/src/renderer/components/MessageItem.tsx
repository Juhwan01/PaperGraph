import { CitationCard } from './CitationCard'
import type { Message } from '../stores/chatStore'

interface Props {
  message: Message
}

export function MessageItem({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <div className={`message-item message-item--${message.role}`}>
      <div className="message-item__avatar">
        {isUser ? '👤' : '🤖'}
      </div>
      <div className="message-item__content">
        <p className="message-item__text">{message.content}</p>

        {message.citations && message.citations.length > 0 && (
          <div className="message-item__citations">
            {message.citations.map((citation, index) => (
              <CitationCard key={citation.paperId} citation={citation} index={index + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
