import { useState, KeyboardEvent } from 'react'
import { useChatStore } from '../stores/chatStore'

export function InputBox() {
  const [input, setInput] = useState('')
  const { sendMessage, isLoading } = useChatStore()

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return

    const message = input.trim()
    setInput('')
    await sendMessage(message)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="input-box">
      <textarea
        className="input-box__textarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="논문에 대해 질문하세요..."
        disabled={isLoading}
        rows={1}
      />
      <button
        className="input-box__button"
        onClick={handleSubmit}
        disabled={!input.trim() || isLoading}
      >
        전송
      </button>
    </div>
  )
}
