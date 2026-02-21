import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { v4 as uuidv4 } from 'uuid'
import type { ChatMessage } from '../../types'

interface ChatState {
  messages: ChatMessage[]
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void
}

export const useChatStore = create<ChatState>()(
  immer((set) => ({
    messages: [],

    addMessage: (msg) => set((s) => {
      s.messages.push({
        ...msg,
        id: uuidv4(),
        timestamp: Date.now(),
      })
      if (s.messages.length > 100) s.messages.shift()
    }),
  }))
)