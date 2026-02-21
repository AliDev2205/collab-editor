import { memo, useCallback, useRef } from 'react'
import { Code2 } from 'lucide-react'
import { useDocumentStore } from '../../store/slices/documentSlice'
import EditorCore from './EditorCore'
import LineNumbers from './LineNumbers'
import CursorLayer from './CursorLayer'
import LatencyIndicator from './LatencyIndicator'

const EditorPanel = memo(() => {
  const content = useDocumentStore((s) => s.content)
  const setContent = useDocumentStore((s) => s.setContent)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleChange = useCallback(
    (val: string) => setContent(val),
    [setContent]
  )

  const lineCount = content.split('\n').length
  const contentHeight = Math.max(lineCount * 21 + 16, 300)

  return (
    <main className="flex-1 flex flex-col overflow-hidden
                     bg-white dark:bg-gray-950
                     border-r border-gray-200/60 dark:border-gray-700/60
                     relative">
      {/* Barre supérieure */}
      <div className="h-9 shrink-0 flex items-center px-4 gap-3
                      border-b border-gray-200/60 dark:border-gray-700/60
                      bg-gray-50/80 dark:bg-gray-900/50">
        <Code2 className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600" />
        <span className="text-xs text-gray-500 dark:text-gray-500 font-medium">
          Éditeur collaboratif
        </span>
        <span className="text-gray-300 dark:text-gray-700">·</span>
        <span className="text-xs text-gray-400 dark:text-gray-600 font-mono tabular-nums">
          {lineCount} lignes · {content.length} chars
        </span>
      </div>

      {/* Zone d'édition — scroll unique partagé */}
      <div
        ref={scrollRef}
        className="flex flex-1 overflow-y-auto overflow-x-hidden"
      >
        <LineNumbers content={content} />

        <div className="relative flex-1" style={{ minHeight: contentHeight }}>
          <EditorCore content={content} onChange={handleChange} contentHeight={contentHeight} />
          <CursorLayer />
        </div>
      </div>

      {/* Latence — fixé dans le coin supérieur droit */}
      <LatencyIndicator />
    </main>
  )
})

EditorPanel.displayName = 'EditorPanel'

export default EditorPanel