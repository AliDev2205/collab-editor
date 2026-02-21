import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { v4 as uuidv4 } from 'uuid'
import type { LogEntry } from '../../types'

interface LogsState {
  logs: LogEntry[]
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  clearLogs: () => void
}

export const useLogsStore = create<LogsState>()(
  immer((set) => ({
    logs: [],

    addLog: (entry) => set((s) => {
      s.logs.push({
        ...entry,
        id: uuidv4(),
        timestamp: Date.now(),
      })
      if (s.logs.length > 200) s.logs.shift()
    }),

    clearLogs: () => set((s) => {
      s.logs = []
    }),
  }))
)