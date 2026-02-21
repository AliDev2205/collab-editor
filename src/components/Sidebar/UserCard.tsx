import { memo } from 'react'
import type { User } from '../../types'
import UserAvatar from './UserAvatar'

interface Props {
  user: User
}

const UserCard = memo(({ user }: Props) => {
  return (
    <div className="flex items-center gap-2.5 p-2.5 rounded-xl
                    bg-white/60 dark:bg-gray-800/40
                    hover:bg-white dark:hover:bg-gray-800/70
                    border border-transparent hover:border-gray-200/60
                    dark:hover:border-gray-700/60
                    transition-all duration-200 group">
      <div className="relative">
        <UserAvatar name={user.name} color={user.color} />
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5
                         bg-emerald-400 border-2 border-white dark:border-gray-900
                         rounded-full shadow-sm" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
            {user.name}
          </span>
          {user.isTyping && (
            <span className="flex items-center gap-0.5 shrink-0">
              <span className="w-1 h-1 bg-violet-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1 h-1 bg-violet-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1 h-1 bg-violet-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </span>
          )}
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">
          {user.operationCount} opération{user.operationCount !== 1 ? 's' : ''}
        </div>
      </div>

      <div
        className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-white/50 dark:ring-gray-900/50"
        style={{ backgroundColor: user.color }}
      />
    </div>
  )
})

export default UserCard