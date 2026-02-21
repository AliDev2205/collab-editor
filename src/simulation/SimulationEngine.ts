import type { User } from '../types'
import { NetworkSimulator } from './NetworkSimulator'
import { OperationGenerator } from './OperationGenerator'
import { useDocumentStore } from '../store/slices/documentSlice'
import { useUsersStore } from '../store/slices/usersSlice'
import { useSyncStore } from '../store/slices/syncSlice'
import { useLogsStore } from '../store/slices/logsSlice'
import { useChatStore } from '../store/slices/chatSlice'

const CHAT_PHRASES = [
  'Je modifie le paragraphe suivant 👀',
  "Quelqu'un peut relire cette section ?",
  "Attention, j'ai supprimé un bloc",
  'OK de mon côté ✅',
  'Je travaille sur la fin du document',
  'Conflit possible ici, je regarde',
  'Presque terminé sur ma partie 🚀',
  "J'ai corrigé une coquille",
]

export class SimulationEngine {
  private timers: ReturnType<typeof setTimeout>[] = []
  private running = false

  start(users: User[]) {
    if (this.running) return
    this.running = true

    users.forEach((user) => {
      this.scheduleNextOp(user)
      this.scheduleNextChat(user)
    })
  }

  private scheduleNextOp(user: User) {
    if (!this.running) return

    // Délai aléatoire entre 1.5s et 4s par user
    const delay = 1500 + Math.random() * 2500

    const timer = setTimeout(async () => {
      await this.executeOperation(user)
      // Planifie la prochaine opération après la fin de celle-ci
      this.scheduleNextOp(user)
    }, delay)

    this.timers.push(timer)
  }

  private scheduleNextChat(user: User) {
    if (!this.running) return

    // Message chat toutes les 8s à 20s
    const delay = 8000 + Math.random() * 12000

    const timer = setTimeout(() => {
      this.sendChatMessage(user)
      this.scheduleNextChat(user)
    }, delay)

    this.timers.push(timer)
  }

  private async executeOperation(user: User) {
    const { content } = useDocumentStore.getState()

    // 1. Marquer l'user comme "en train d'écrire"
    useUsersStore.getState().updateUserTyping(user.id, true)
    useSyncStore.getState().setStatus('syncing')

    // 2. Générer une opération
    const op = OperationGenerator.generate(content, user)

    // 3. Simuler le réseau
    const { data, latency } = await NetworkSimulator.send(op)

    // 4. Mettre à jour la latence affichée
    useSyncStore.getState().setLatency(latency)

    if (data === null) {
      // Paquet perdu
      useLogsStore.getState().addLog({
        userId: user.id,
        userName: user.name,
        color: user.color,
        action: '⚠️ paquet perdu (réseau)',
      })
      useSyncStore.getState().setStatus('connected')
    } else {
      // 5. Appliquer l'opération au document
      const currentContent = useDocumentStore.getState().content
      let newContent = currentContent

      if (data.type === 'insert') {
        const pos = Math.min(data.position, currentContent.length)
        newContent =
          currentContent.slice(0, pos) + data.text + currentContent.slice(pos)

        useLogsStore.getState().addLog({
          userId: user.id,
          userName: user.name,
          color: user.color,
          action: `insert "${data.text.trim()}" @${pos}`,
        })

        useUsersStore.getState().updateCursor(user.id, pos + data.text.length)

      } else if (data.type === 'delete') {
        const pos = Math.min(data.position, Math.max(currentContent.length - 1, 0))
        const len = Math.min(data.length, currentContent.length - pos)

        if (len > 0) {
          const deleted = currentContent.slice(pos, pos + len)
          newContent = currentContent.slice(0, pos) + currentContent.slice(pos + len)

          useLogsStore.getState().addLog({
            userId: user.id,
            userName: user.name,
            color: user.color,
            action: `delete "${deleted.trim() || '⏎'}" @${pos}`,
          })

          useUsersStore.getState().updateCursor(user.id, pos)
        }
      }

      // setContentSilent : pas d'historique undo pour les ops externes
      useDocumentStore.getState().setContentSilent(newContent)
      useUsersStore.getState().incrementOps(user.id)
      useSyncStore.getState().setStatus('connected')
    }

    // 6. Stopper le typing indicator après 800ms
    const typingTimer = setTimeout(() => {
      useUsersStore.getState().updateUserTyping(user.id, false)
    }, 800)

    this.timers.push(typingTimer)
  }

  private sendChatMessage(user: User) {
    if (!this.running) return
    const text = CHAT_PHRASES[Math.floor(Math.random() * CHAT_PHRASES.length)]
    useChatStore.getState().addMessage({
      userId: user.id,
      userName: user.name,
      color: user.color,
      text,
    })
  }

  stop() {
    this.running = false
    this.timers.forEach(clearTimeout)
    this.timers = []
  }

  isRunning() {
    return this.running
  }
}