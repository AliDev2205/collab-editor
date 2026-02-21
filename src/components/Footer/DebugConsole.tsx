import { useEffect, useState } from 'react'
import { FileText, Rows3, Zap, GitMerge, CircleDot } from 'lucide-react'
import { useDocumentStore } from '../../store/slices/documentSlice'
import { useSyncStore } from '../../store/slices/syncSlice'
import type { SyncStatus } from '../../types'
import clsx from 'clsx'

const STATUS_CONFIG: Record<SyncStatus, { color: string; dotColor: string }> = {
  connected: { color: 'text-emerald-400', dotColor: 'bg-emerald-400' },
  syncing: { color: 'text-amber-400', dotColor: 'bg-amber-400' },
  disconnected: { color: 'text-red-400', dotColor: 'bg-red-400' },
}

const DebugConsole = () => {
  const [stats, setStats] = useState({
    chars: 0,
    lines: 1,
    latency: 0,
    status: 'connected' as SyncStatus,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const { content } = useDocumentStore.getState()
      const { latency, status } = useSyncStore.getState()
      setStats({
        chars: content.length,
        lines: content.split('\n').length,
        latency,
        status,
      })
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const { color, dotColor } = STATUS_CONFIG[stats.status]

  return (
    <footer className="h-7 shrink-0 flex items-center px-4 gap-5
                       bg-gray-900 dark:bg-black border-t border-gray-800
                       text-xs font-mono overflow-hidden select-none">
      <span className={clsx('flex items-center gap-1.5', color)}>
        <CircleDot className="w-3 h-3" />
        <span className={clsx('w-1.5 h-1.5 rounded-full', dotColor,
          stats.status === 'syncing' && 'animate-subtle-pulse'
        )} />
        <span className="capitalize">{stats.status}</span>
      </span>

      <span className="h-3 w-px bg-gray-700" />

      <span className="flex items-center gap-1.5 text-gray-400">
        <FileText className="w-3 h-3" />
        <span className="tabular-nums">{stats.chars} chars</span>
      </span>
      <span className="flex items-center gap-1.5 text-gray-400">
        <Rows3 className="w-3 h-3" />
        <span className="tabular-nums">{stats.lines} lignes</span>
      </span>

      <span className="h-3 w-px bg-gray-700" />

      <span className="flex items-center gap-1.5 text-gray-500">
        <GitMerge className="w-3 h-3" />
        OT simulé
      </span>
      <span className="flex items-center gap-1.5 text-gray-400">
        <Zap className="w-3 h-3" />
        <span className="tabular-nums">{stats.latency}ms</span>
      </span>

      <span className="text-gray-700 ml-auto hidden md:inline tracking-tight">
        CollabEditor v1.0 — NiyiExpertise
      </span>
    </footer>
  )
}

export default DebugConsole
