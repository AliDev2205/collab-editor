import { memo } from 'react'
import { getContrastColor } from '../../utils/colorUtils'

interface Props {
  name: string
  color: string
  size?: 'sm' | 'md'
}

const UserAvatar = memo(({ name, color, size = 'md' }: Props) => {
  const initials = name.slice(0, 2).toUpperCase()
  const textColor = getContrastColor(color)
  const sizeClass = size === 'sm'
    ? 'w-6 h-6 text-[10px]'
    : 'w-8 h-8 text-xs'

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center
                  font-bold shrink-0 select-none shadow-sm
                  ring-2 ring-white/30 dark:ring-gray-900/30`}
      style={{ backgroundColor: color, color: textColor }}
    >
      {initials}
    </div>
  )
})

export default UserAvatar