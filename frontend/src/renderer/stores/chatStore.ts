import { create } from 'zustand'
import { api } from '../services/api'

export interface Citation {
  paperId: string
  title: string
  authors: string[]
  year: number
  relevance: number
  url?: string
  citationsCount?: number
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  citations?: Citation[]
  timestamp: Date
}

interface ChatState {
  sessionId: string | null
  messages: Message[]
  isLoading: boolean
  panelState: 'collapsed' | 'expanded' | 'fullscreen'

  // Actions
  initSession: () => Promise<void>
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  setPanelState: (state: 'collapsed' | 'expanded' | 'fullscreen') => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessionId: null,
  messages: [],
  isLoading: false,
  panelState: 'expanded',

  initSession: async () => {
    try {
      const { sessionId } = await api.createSession()
      set({ sessionId })
    } catch (error) {
      console.error('Failed to create session:', error)
    }
  },

  sendMessage: async (content: string) => {
    const { sessionId, messages } = get()

    if (!sessionId) {
      await get().initSession()
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    set({
      messages: [...messages, userMessage],
      isLoading: true,
    })

    try {
      const response = await api.sendMessage({
        sessionId: get().sessionId!,
        message: content,
      })

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.answer,
        citations: response.citations,
        timestamp: new Date(),
      }

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
      }))
    } catch (error) {
      console.error('Failed to send message:', error)
      set({ isLoading: false })
    }
  },

  clearMessages: () => {
    set({ messages: [] })
  },

  setPanelState: (panelState) => {
    set({ panelState })
  },
}))
