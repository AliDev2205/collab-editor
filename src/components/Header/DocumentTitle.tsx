import { useState, useRef, useEffect, memo } from 'react'
import { Pencil } from 'lucide-react'
import { useDocumentStore } from '../../store/slices/documentSlice'

const DocumentTitle = memo(() => {
  const title = useDocumentStore((s) => s.title)
  const setTitle = useDocumentStore((s) => s.setTitle)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  const confirm = () => {
    setTitle(draft.trim() || 'Document sans titre')
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={confirm}
        onKeyDown={(e) => {
          if (e.key === 'Enter') confirm()
          if (e.key === 'Escape') setEditing(false)
        }}
        className="bg-transparent border-b-2 border-violet-400 outline-none font-semibold
                   text-gray-900 dark:text-white px-1 w-48 text-sm
                   transition-colors"
      />
    )
  }

  return (
    <button
      onClick={() => { setDraft(title); setEditing(true) }}
      className="group flex items-center gap-1.5 font-semibold text-sm
                 text-gray-900 dark:text-white hover:text-violet-500
                 dark:hover:text-violet-400 transition-colors cursor-text"
      title="Cliquer pour renommer"
    >
      {title}
      <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
    </button>
  )
})

export default DocumentTitle