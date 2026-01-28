import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Session {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
}

interface SessionState {
  currentSessionId: string | null
  sessions: Session[]

  // Actions
  createSession: () => string
  deleteSession: (id: string) => void
  setCurrentSession: (id: string | null) => void
  updateSessionTitle: (id: string, title: string) => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      currentSessionId: null,
      sessions: [],

      createSession: () => {
        const id = crypto.randomUUID()
        const newSession: Session = {
          id,
          title: '새 대화',
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: id,
        }))

        return id
      },

      deleteSession: (id: string) => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
          currentSessionId:
            state.currentSessionId === id ? null : state.currentSessionId,
        }))
      },

      setCurrentSession: (id: string | null) => {
        set({ currentSessionId: id })
      },

      updateSessionTitle: (id: string, title: string) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, title, updatedAt: new Date() } : s
          ),
        }))
      },
    }),
    {
      name: 'papergraph-sessions',
    }
  )
)
