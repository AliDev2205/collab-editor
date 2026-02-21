import { memo, useCallback } from 'react'

interface Props {
  content: string
  onChange: (val: string) => void
  contentHeight: number
}

const EditorCore = memo(({ content, onChange, contentHeight }: Props) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value)
    },
    [onChange]
  )

  return (
    <textarea
    id="editor-textarea"
      value={content}
      onChange={handleChange}
      className="w-full resize-none outline-none overflow-hidden
                 font-mono text-sm leading-[21px] pt-2 px-3 bg-transparent
                 text-gray-800 dark:text-gray-200
                 placeholder-gray-300 dark:placeholder-gray-700"
      style={{ minHeight: contentHeight, height: contentHeight }}
      placeholder="Commencez à écrire..."
      spellCheck={false}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      data-gramm="false"
      data-gramm_editor="false"
      data-enable-grammarly="false"
      translate="no"
    />
  )
})

EditorCore.displayName = 'EditorCore'

export default EditorCore