import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { SyncStatus } from '../../types'

interface SyncState {
  status: SyncStatus
  latency: number
  setStatus: (status: SyncStatus) => void
  setLatency: (ms: number) => void
}

export const useSyncStore = create<SyncState>()(
  immer((set) => ({
    status: 'connected',
    latency: 0,

    setStatus: (status) => set((s) => {
      s.status = status
    }),

    setLatency: (ms) => set((s) => {
      s.latency = ms
    }),
  }))
)