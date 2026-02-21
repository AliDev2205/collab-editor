import { memo } from 'react'
import { Users, Radio } from 'lucide-react'
import { useUsersStore } from '../../store/slices/usersSlice'
import UserCard from './UserCard'

const LeftSidebar = memo(() => {
  const users = useUsersStore((s) => s.users)

  return (
    <aside className="w-56 shrink-0 flex flex-col border-r border-gray-200/60
                      dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-900/50
                      h-full">
      <div className="px-4 py-3 border-b border-gray-200/60 dark:border-gray-700/60">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
          <h2 className="text-xs font-semibold uppercase tracking-wider
                         text-gray-500 dark:text-gray-400">
            Utilisateurs
          </h2>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <Radio className="w-3 h-3 text-emerald-500 animate-subtle-pulse" />
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {users.length} en ligne
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      <div className="p-3 border-t border-gray-200/60 dark:border-gray-700/60">
        <div className="text-xs text-center text-gray-400 dark:text-gray-600 font-medium">
          Mode collaboratif actif
        </div>
      </div>
    </aside>
  )
})

LeftSidebar.displayName = 'LeftSidebar'

export default LeftSidebar