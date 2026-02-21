import { memo } from 'react'
import { Sparkles, Moon, Sun } from 'lucide-react'
import DocumentTitle from './DocumentTitle'
import ConnectionStatus from './ConnectionStatus'
import UndoRedoControls from './UndoRedoControls'

interface HeaderProps {
  onToggleDark: () => void
  dark: boolean
}

const Header = memo(({ onToggleDark, dark }: HeaderProps) => {
  return (
    <header className="h-12 shrink-0 flex items-center justify-between px-4
                       bg-white/80 dark:bg-gray-900/80 glass
                       border-b border-gray-200/60 dark:border-gray-700/60
                       shadow-sm z-10">
      {/* Gauche : logo + titre */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-violet-500" />
          <span className="text-violet-500 font-semibold text-sm tracking-tight hidden sm:inline">
            CollabEditor
          </span>
        </div>
        <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">/</span>
        <DocumentTitle />
      </div>

      {/* Centre : statut connexion */}
      <ConnectionStatus />

      {/* Droite : undo/redo + dark mode */}
      <div className="flex items-center gap-1.5">
        <UndoRedoControls />
        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />
        <button
          onClick={onToggleDark}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400
                     hover:bg-gray-100 dark:hover:bg-gray-800
                     hover:text-gray-700 dark:hover:text-gray-200
                     transition-all duration-200"
          title="Basculer dark/light mode"
          aria-label={dark ? 'Activer le mode clair' : 'Activer le mode sombre'}
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  )
})

export default Header