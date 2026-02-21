import { memo } from 'react'

interface Props {
  content: string
}

const LineNumbers = memo(({ content }: Props) => {
  const lineCount = content.split('\n').length

  return (
    <div className="select-none text-right pr-3 pt-2 font-mono text-xs
                    text-gray-400 dark:text-gray-600 w-10 shrink-0
                    border-r border-gray-200/60 dark:border-gray-700/60
                    bg-gray-50/50 dark:bg-gray-900/40">
      {Array.from({ length: lineCount }, (_, i) => (
        <div key={i} className="leading-[21px]">
          {i + 1}
        </div>
      ))}
    </div>
  )
}, (prev, next) => {
  // Ne rerender que si le nombre de lignes change
  return prev.content.split('\n').length === next.content.split('\n').length
})

LineNumbers.displayName = 'LineNumbers'

export default LineNumbers