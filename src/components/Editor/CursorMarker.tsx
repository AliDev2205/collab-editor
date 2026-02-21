import { memo } from 'react'
import { getContrastColor } from '../../utils/colorUtils'

interface Props {
  name: string
  color: string
  x: number
  y: number
}

const CursorMarker = memo(({ name, color, x, y }: Props) => {
  const textColor = getContrastColor(color)

  return (
    <div
      className="absolute flex flex-col items-start pointer-events-none
                 transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{ left: x, top: y, zIndex: 20 }}
    >
      {/* Barre verticale curseur */}
      <div
        className="w-[2px] h-[21px] rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]"
        style={{ backgroundColor: color }}
      />
      {/* Label nom */}
      <div
        className="rounded-[4px] px-1.5 py-0.5 whitespace-nowrap -mt-0.5 shadow-sm border border-black/5 dark:border-white/5 animate-fade-in"
        style={{ backgroundColor: color, color: textColor }}
      >
        <span className="text-[10px] font-mono leading-none font-semibold">
          {name}
        </span>
      </div>
    </div>
  )
})

export default CursorMarker