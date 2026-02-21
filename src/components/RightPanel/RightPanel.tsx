import { memo, useState } from 'react'
import { Activity, MessageCircle } from 'lucide-react'
import ActivityLog from './ActivityLog'
import ChatModule from './ChatModule'
import { useLogsStore } from '../../store/slices/logsSlice'
import { useChatStore } from '../../store/slices/chatSlice'
import clsx from 'clsx'

type Tab = 'logs' | 'chat'

const RightPanel = memo(() => {
  const [activeTab, setActiveTab] = useState<Tab>('logs')
  const logCount = useLogsStore((s) => s.logs.length)
  const msgCount = useChatStore((s) => s.messages.length)

  const tabClass = (tab: Tab) =>
    clsx(
      'flex-1 text-xs py-2.5 font-medium transition-all duration-200',
      'flex items-center justify-center gap-1.5',
      activeTab === tab
        ? 'text-violet-500 border-b-2 border-violet-500 bg-violet-50/50 dark:bg-violet-500/5'
        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
    )

  const Badge = ({ count }: { count: number }) => (
    <span className="bg-gray-100 dark:bg-gray-800 text-gray-500
                     dark:text-gray-400 rounded-full px-1.5 py-0.5
                     text-[10px] font-semibold tabular-nums min-w-[20px] text-center">
      {count}
    </span>
  )

  return (
    <aside className="w-72 shrink-0 flex flex-col border-l border-gray-200/60
                      dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-900/50
                      overflow-hidden h-full">
      {/* Onglets */}
      <div className="flex border-b border-gray-200/60 dark:border-gray-700/60 shrink-0">
        <button className={tabClass('logs')} onClick={() => setActiveTab('logs')}>
          <Activity className="w-3.5 h-3.5" />
          Activité
          <Badge count={logCount} />
        </button>
        <button className={tabClass('chat')} onClick={() => setActiveTab('chat')}>
          <MessageCircle className="w-3.5 h-3.5" />
          Chat
          <Badge count={msgCount} />
        </button>
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="flex flex-1 overflow-hidden flex-col">
        {activeTab === 'logs' ? <ActivityLog /> : <ChatModule />}
      </div>
    </aside>
  )
})

export default RightPanel