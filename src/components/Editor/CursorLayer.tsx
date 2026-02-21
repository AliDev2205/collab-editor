import { memo, useMemo } from 'react'
import { useUsersStore } from '../../store/slices/usersSlice'
import { useDocumentStore } from '../../store/slices/documentSlice'
import { calculateCursorCoords } from '../../utils/lineUtils'
import CursorMarker from './CursorMarker'

const CursorLayer = memo(() => {
  const users = useUsersStore((s) => s.users)
  const content = useDocumentStore((s) => s.content)

  const cursors = useMemo(() =>
    users.map((user) => ({
      id: user.id,
      name: user.name,
      color: user.color,
      coords: calculateCursorCoords(
        Math.min(user.cursorPosition, content.length),
        content
      ),
    })),
    [users, content]
  )

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {cursors.map(({ id, name, color, coords }) => (
        <CursorMarker
          key={id}
          name={name}
          color={color}
          x={coords.x}
          y={coords.y}
        />
      ))}
    </div>
  )
})

CursorLayer.displayName = 'CursorLayer'

export default CursorLayer