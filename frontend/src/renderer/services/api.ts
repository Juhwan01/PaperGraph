const API_BASE_URL = 'http://localhost:8000/api/v1'

export interface ChatRequest {
  sessionId: string
  message: string
  stream?: boolean
}

export interface ChatResponse {
  answer: string
  citations: Array<{
    paperId: string
    title: string
    authors: string[]
    year: number
    relevance: number
    url?: string
    citationsCount?: number
  }>
  confidenceScore: number
}

export interface Paper {
  id: string
  title: string
  authors: string[]
  abstract: string
  year: number
  venue?: string
  citationsCount?: number
  url?: string
}

class PaperGraphAPI {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${this.baseURL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: request.sessionId,
        message: request.message,
        stream: request.stream ?? false,
      }),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }

  async getPaper(paperId: string): Promise<Paper> {
    const response = await fetch(`${this.baseURL}/papers/${encodeURIComponent(paperId)}`)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }

  async createSession(): Promise<{ sessionId: string }> {
    const response = await fetch(`${this.baseURL}/sessions`, {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }

  async deleteSession(sessionId: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/sessions/${sessionId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }
  }
}

export const api = new PaperGraphAPI()
