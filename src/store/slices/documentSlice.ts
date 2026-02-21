import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface DocumentState {
  title: string
  content: string
  history: string[]
  future: string[]
  setTitle: (title: string) => void
  setContent: (content: string) => void
  setContentSilent: (content: string) => void // pour la simulation (sans historique)
  undo: () => void
  redo: () => void
}

/**
 * Document Store
 *
 * Note : L'historique undo/redo est volontairement simplifié dans cette simulation.
 * Les opérations des utilisateurs distants utilisent `setContentSilent` (sans historique)
 * pour éviter de polluer l'historique de l'utilisateur local. Cependant, en cas d'édition
 * concurrente réelle, un vrai système OT ou CRDT serait nécessaire pour garantir la
 * cohérence de l'undo dans un contexte multi-utilisateurs.
 */
export const useDocumentStore = create<DocumentState>()(
  immer((set) => ({
    title: 'Document sans titre',
    content: '',
    history: [],
    future: [],

    setTitle: (title) => set((s) => {
      s.title = title
    }),

    setContent: (content) => set((s) => {
      s.history.push(s.content)
      if (s.history.length > 100) s.history.shift()
      s.future = []
      s.content = content
    }),

    // Utilisé par la simulation : pas d'historique undo pour les ops externes
    setContentSilent: (content) => set((s) => {
      s.content = content
    }),

    undo: () => set((s) => {
      if (!s.history.length) return
      s.future.unshift(s.content)
      s.content = s.history.pop()!
    }),

    redo: () => set((s) => {
      if (!s.future.length) return
      s.history.push(s.content)
      s.content = s.future.shift()!
    }),
  }))
)