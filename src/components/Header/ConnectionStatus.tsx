import { memo } from 'react'
import { Wifi, WifiOff, RefreshCw } from 'lucide-react'
import { useSyncStore } from '../../store/slices/syncSlice'
import type { SyncStatus } from '../../types'
import clsx from 'clsx'

const STATUS_CONFIG: Record<SyncStatus, {
  label: string
  icon: typeof Wifi
  color: string
  dotColor: string
  pulse: boolean
}> = {
  connected: {
    label: 'Connecté',
    icon: Wifi,
    color: 'text-emerald-500',
    dotColor: 'bg-emerald-500',
    pulse: false,
  },
  syncing: {
    label: 'Synchronisation…',
    icon: RefreshCw,
    color: 'text-amber-500',
    dotColor: 'bg-amber-400',
    pulse: true,
  },
  disconnected: {
    label: 'Déconnecté',
    icon: WifiOff,
    color: 'text-red-500',
    dotColor: 'bg-red-500',
    pulse: false,
  },
}

const ConnectionStatus = memo(() => {
  const status = useSyncStore((s) => s.status)
  const latency = useSyncStore((s) => s.latency)
  const { label, icon: Icon, color, dotColor, pulse } = STATUS_CONFIG[status]

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full
                 bg-gray-50 dark:bg-gray-800/60 border border-gray-200/60
                 dark:border-gray-700/60"
      role="status"
      aria-live="polite"
      aria-label={`Statut: ${label}`}
    >
      <span className="relative flex items-center">
        <span
          className={clsx(
            'w-2 h-2 rounded-full',
            dotColor,
            pulse && 'animate-subtle-pulse'
          )}
        />
        {pulse && (
          <span className={clsx(
            'absolute w-2 h-2 rounded-full animate-ping',
            dotColor, 'opacity-40'
          )} />
        )}
      </span>
      <Icon className={clsx('w-3.5 h-3.5', color, pulse && 'animate-spin')} style={pulse ? { animationDuration: '2s' } : {}} />
      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 hidden sm:inline">
        {label}
      </span>
      {status !== 'disconnected' && (
        <span className="text-xs text-gray-400 dark:text-gray-500 font-mono hidden md:inline">
          {latency}ms
        </span>
      )}
    </div>
  )
})

export default ConnectionStatus