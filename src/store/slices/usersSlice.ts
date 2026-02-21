import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { User } from '../../types'

interface UsersState {
  users: User[]
  updateUserTyping: (id: string, typing: boolean) => void
  incrementOps: (id: string) => void
  updateCursor: (id: string, pos: number) => void
}

export const useUsersStore = create<UsersState>()(
  immer((set) => ({
    users: [
      {
        id: 'u1',
        name: 'Alice',
        color: '#6366f1',
        isTyping: false,
        operationCount: 0,
        cursorPosition: 0,
      },
      {
        id: 'u2',
        name: 'Bob',
        color: '#f43f5e',
        isTyping: false,
        operationCount: 0,
        cursorPosition: 0,
      },
      {
        id: 'u3',
        name: 'Carol',
        color: '#10b981',
        isTyping: false,
        operationCount: 0,
        cursorPosition: 0,
      },
    ],

    updateUserTyping: (id, typing) => set((s) => {
      const user = s.users.find((u) => u.id === id)
      if (user) user.isTyping = typing
    }),

    incrementOps: (id) => set((s) => {
      const user = s.users.find((u) => u.id === id)
      if (user) user.operationCount++
    }),

    updateCursor: (id, pos) => set((s) => {
      const user = s.users.find((u) => u.id === id)
      if (user) user.cursorPosition = pos
    }),
  }))
)