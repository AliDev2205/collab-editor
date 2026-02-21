export function positionToLineCol(
  text: string,
  position: number
): { line: number; col: number } {
  const before = text.slice(0, Math.max(0, position))
  const lines = before.split('\n')
  return {
    line: lines.length - 1,
    col: lines[lines.length - 1].length,
  }
}

export const CHAR_WIDTH = 8.4
export const LINE_HEIGHT = 21
export const EDITOR_PAD_LEFT = 12  // px-3
export const EDITOR_PAD_TOP = 8   // pt-2

export function calculateCursorCoords(
  position: number,
  content: string
): { x: number; y: number } {
  const safePos = Math.max(0, Math.min(position, content.length))
  const { line, col } = positionToLineCol(content, safePos)
  return {
    x: col * CHAR_WIDTH + EDITOR_PAD_LEFT,
    y: line * LINE_HEIGHT + EDITOR_PAD_TOP,
  }
}