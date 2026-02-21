import { memo } from 'react'
import { Gauge } from 'lucide-react'
import { useSyncStore } from '../../store/slices/syncSlice'
import clsx from 'clsx'

const LatencyIndicator = memo(() => {
  const latency = useSyncStore((s) => s.latency)
  const status = useSyncStore((s) => s.status)

  const color =
    latency < 300 ? 'text-emerald-400' :
      latency < 800 ? 'text-amber-400' :
        'text-red-400'

  return (
    <div className={clsx(
      'absolute top-11 right-3 text-xs font-mono flex items-center gap-1.5',
      'glass glass-light px-2 py-1 rounded-lg shadow-sm',
      'pointer-events-none z-30 border border-gray-200/30 dark:border-gray-700/30',
      color
    )}>
      <Gauge className="w-3 h-3" />
      <span className={clsx(
        'w-1.5 h-1.5 rounded-full bg-current',
        status === 'syncing' && 'animate-subtle-pulse'
      )} />
      <span className="tabular-nums font-medium">{latency}ms</span>
    </div>
  )
})

export default LatencyIndicator