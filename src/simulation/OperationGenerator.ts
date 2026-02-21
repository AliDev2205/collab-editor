import type { Operation, User } from '../types'

const SENTENCES = [
  'React améliore les performances UI. ',
  'TypeScript garantit la sécurité du typage. ',
  'La synchronisation est en cours. ',
  'Architecture propre et modulaire. ',
  'Zustand simplifie la gestion d\'état. ',
  'Les composants sont mémoïsés. ',
  'La latence réseau est simulée. ',
  'Immer facilite les mutations immuables. ',
  'Le curseur suit les modifications. ',
  'Performance optimisée avec useMemo. ',
]

export class OperationGenerator {
  static generate(content: string, user: User): Operation {
    const shouldInsert = content.length < 300 || Math.random() > 0.3

    if (shouldInsert) {
      const sentence = SENTENCES[Math.floor(Math.random() * SENTENCES.length)]

      // Toutes les 4 phrases environ, on saute une ligne
      const addNewline = Math.random() < 0.25
      const text = addNewline ? '\n' + sentence : sentence

      // Insérer uniquement en fin de document
      const position = content.length

      return { type: 'insert', position, text, userId: user.id }

    } else {
      if (content.length < 20) {
        return { type: 'insert', position: content.length, text: SENTENCES[0], userId: user.id }
      }
    
            // Ne jamais remonter au-delà du dernier \n
      const lastNewline = content.lastIndexOf('\n')
      const lastLineStart = lastNewline === -1 ? 0 : lastNewline + 1
      const lastLine = content.slice(lastLineStart)
    
      if (lastLine.length < 10) {
        return { type: 'insert', position: content.length, text: SENTENCES[0], userId: user.id }
      }
    
      const deleteLen = Math.min(
        Math.floor(Math.random() * 15) + 5,
        lastLine.length  // jamais au-delà du début de la dernière ligne
      )
    
      return {
        type: 'delete',
        position: content.length - deleteLen,
        length: deleteLen,
        userId: user.id,
      }
    }
   }
}