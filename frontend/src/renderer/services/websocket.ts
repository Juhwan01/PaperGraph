const WS_BASE_URL = 'ws://localhost:8000/ws'

export type MessageType = 'token' | 'citation' | 'done' | 'error'

export interface StreamMessage {
  type: MessageType
  content?: string
  citation?: {
    paperId: string
    title: string
    authors: string[]
    year: number
    relevance: number
    url?: string
    citationsCount?: number
  }
  citations?: Array<{
    paperId: string
    title: string
    authors: string[]
    year: number
    relevance: number
    url?: string
    citationsCount?: number
  }>
  error?: string
}

export type StreamCallback = (message: StreamMessage) => void

export class WebSocketService {
  private ws: WebSocket | null = null
  private sessionId: string
  private callbacks: Set<StreamCallback> = new Set()

  constructor(sessionId: string) {
    this.sessionId = sessionId
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(`${WS_BASE_URL}/chat/${this.sessionId}`)

      this.ws.onopen = () => {
        resolve()
      }

      this.ws.onerror = (error) => {
        reject(error)
      }

      this.ws.onmessage = (event) => {
        const message: StreamMessage = JSON.parse(event.data)
        this.callbacks.forEach((callback) => callback(message))
      }

      this.ws.onclose = () => {
        this.ws = null
      }
    })
  }

  disconnect(): void {
    this.ws?.close()
    this.ws = null
  }

  send(message: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(message)
    }
  }

  onMessage(callback: StreamCallback): () => void {
    this.callbacks.add(callback)
    return () => {
      this.callbacks.delete(callback)
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}
