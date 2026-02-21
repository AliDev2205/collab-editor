import { memo, useEffect, useRef } from 'react'
import { useLogsStore } from '../../store/slices/logsSlice'

const ActivityLog = memo(() => {
  const logs = useLogsStore((s) => s.logs)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs.length])

  return (
    <div className="flex-1 overflow-y-auto p-2.5 space-y-0.5">
      {logs.length === 0 && (
        <p className="text-xs text-gray-400 dark:text-gray-600 text-center mt-8 font-medium">
          En attente des opérations…
        </p>
      )}
      {logs.map((log, i) => (
        <div
          key={log.id}
          className="flex items-start gap-2 text-xs py-1.5 px-2 rounded-lg
                     hover:bg-white/60 dark:hover:bg-gray-800/40
                     transition-colors duration-150 animate-fade-in-up"
          style={{ animationDelay: `${Math.min(i * 10, 200)}ms` }}
        >
          <span
            className="w-2 h-2 rounded-full shrink-0 mt-1 ring-1 ring-white/50 dark:ring-gray-900/50"
            style={{ backgroundColor: log.color }}
          />
          <div className="flex-1 min-w-0">
            <span
              className="font-semibold"
              style={{ color: log.color }}
            >
              {log.userName}
            </span>
            <span className="text-gray-600 dark:text-gray-400 ml-1.5">
              {log.action}
            </span>
          </div>
          <span className="text-[10px] text-gray-300 dark:text-gray-700 shrink-0 font-mono tabular-nums mt-0.5">
            {new Date(log.timestamp).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
})

export default ActivityLog