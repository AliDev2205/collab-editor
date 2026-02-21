import { memo, useEffect } from 'react'
import { Undo2, Redo2 } from 'lucide-react'
import { useDocumentStore } from '../../store/slices/documentSlice'
import clsx from 'clsx'

const UndoRedoControls = memo(() => {
  const undo = useDocumentStore((s) => s.undo)
  const redo = useDocumentStore((s) => s.redo)
  const canUndo = useDocumentStore((s) => s.history.length > 0)
  const canRedo = useDocumentStore((s) => s.future.length > 0)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return
      if (e.key === 'z') {
        e.preventDefault()
        e.shiftKey ? redo() : undo()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo])

  return (
    <div className="flex gap-0.5">
      <button
        onClick={undo}
        disabled={!canUndo}
        className={clsx(
          'p-2 rounded-lg transition-all duration-200',
          canUndo
            ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white active:scale-95'
            : 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
        )}
        title="Annuler (Ctrl+Z)"
        aria-label="Annuler la dernière action"
      >
        <Undo2 className="w-4 h-4" />
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className={clsx(
          'p-2 rounded-lg transition-all duration-200',
          canRedo
            ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white active:scale-95'
            : 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
        )}
        title="Rétablir (Ctrl+Shift+Z)"
        aria-label="Rétablir la dernière action annulée"
      >
        <Redo2 className="w-4 h-4" />
      </button>
    </div>
  )
})

export default UndoRedoControls