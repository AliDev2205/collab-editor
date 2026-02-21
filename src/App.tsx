import { useEffect, useState } from 'react'
import { Users, MessageSquare } from 'lucide-react'
import { useSimulation } from './hooks/useSimulation'
import { useUIStore } from './store/slices/uiSlice'
import Header from './components/Header/Header'
import LeftSidebar from './components/Sidebar/LeftSidebar'
import EditorPanel from './components/Editor/EditorPanel'
import RightPanel from './components/RightPanel/RightPanel'
import DebugConsole from './components/Footer/DebugConsole'

function App() {
  const [dark, setDark] = useState(true)
  useSimulation()

  const leftOpen = useUIStore((s) => s.leftOpen)
  const rightOpen = useUIStore((s) => s.rightOpen)
  const toggleLeft = useUIStore((s) => s.toggleLeft)
  const toggleRight = useUIStore((s) => s.toggleRight)
  const closeAll = useUIStore((s) => s.closeAll)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-gray-100 overflow-hidden selection:bg-violet-500/20">
      {/* Header */}
      <Header onToggleDark={() => setDark((d) => !d)} dark={dark} />

      {/* Corps principal */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Panneau gauche — desktop */}
        <div className="hidden md:flex h-full shadow-[1px_0_0_0_rgba(0,0,0,0.05)] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.02)]">
          <LeftSidebar />
        </div>

        {/* Zone centrale */}
        <EditorPanel />

        {/* Panneau droit — desktop */}
        <div className="hidden lg:flex h-full shadow-[-1px_0_0_0_rgba(0,0,0,0.05)] dark:shadow-[-1px_0_0_0_rgba(255,255,255,0.02)]">
          <RightPanel />
        </div>

        {/* ── Mobile drawers ── */}
        {/* Backdrop */}
        {(leftOpen || rightOpen) && (
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 md:hidden lg:hidden animate-fade-in"
            onClick={closeAll}
          />
        )}

        {/* Drawer gauche (utilisateurs) */}
        <div
          className={`fixed top-12 left-0 bottom-7 w-64 z-50 transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                      md:hidden ${leftOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
        >
          <LeftSidebar />
        </div>

        {/* Drawer droit (activité / chat) */}
        <div
          className={`fixed top-12 right-0 bottom-7 w-72 z-50 transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                      lg:hidden ${rightOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'}`}
        >
          <RightPanel />
        </div>
      </div>

      {/* Footer */}
      <DebugConsole />

      {/* ── Boutons mobile ── */}
      <div className="fixed bottom-10 left-3 z-50 md:hidden pointer-events-none">
        <button
          onClick={toggleLeft}
          className="w-12 h-12 rounded-full pointer-events-auto
                     bg-violet-600 text-white shadow-xl shadow-violet-500/20 flex items-center justify-center
                     hover:bg-violet-700 active:scale-90 transition-all duration-200"
          aria-label="Afficher les utilisateurs"
        >
          <Users className="w-5 h-5" />
        </button>
      </div>

      <div className="fixed bottom-10 right-3 z-50 lg:hidden pointer-events-none">
        <button
          onClick={toggleRight}
          className="w-12 h-12 rounded-full pointer-events-auto
                     bg-violet-600 text-white shadow-xl shadow-violet-500/20 flex items-center justify-center
                     hover:bg-violet-700 active:scale-90 transition-all duration-200"
          aria-label="Afficher activité et chat"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default App