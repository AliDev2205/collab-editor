import { memo, useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { useChatStore } from '../../store/slices/chatSlice'
import UserAvatar from '../Sidebar/UserAvatar'

const ChatModule = memo(() => {
  const messages = useChatStore((s) => s.messages)
  const addMessage = useChatStore((s) => s.addMessage)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const send = () => {
    const text = input.trim()
    if (!text) return
    addMessage({
      userId: 'me',
      userName: 'Moi',
      color: '#a855f7',
      text,
    })
    setInput('')
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-600 text-center mt-8 font-medium">
            Aucun message…
          </p>
        )}
        {messages.map((msg) => {
          const isMe = msg.userId === 'me'

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 animate-fade-in-up ${isMe ? 'flex-row-reverse' : ''}`}
            >
              <UserAvatar name={msg.userName} color={msg.color} size="sm" />
              <div
                className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <span
                  className="text-[10px] font-semibold mb-0.5 px-1"
                  style={{ color: msg.color }}
                >
                  {msg.userName}
                </span>
                <div
                  className={`text-xs px-3 py-2 leading-relaxed
                    ${isMe
                      ? 'bg-violet-500 text-white rounded-2xl rounded-br-md'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-md border border-gray-200/60 dark:border-gray-700/60'
                    }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-300 dark:text-gray-700 mt-0.5 px-1 font-mono tabular-nums">
                  {new Date(msg.timestamp).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-2.5 border-t border-gray-200/60 dark:border-gray-700/60 flex gap-2">
        <input
        id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Écrire un message…"
          className="flex-1 text-sm px-3 py-2 rounded-xl
                     bg-white dark:bg-gray-800
                     text-gray-800 dark:text-gray-200
                     placeholder-gray-400 dark:placeholder-gray-600
                     outline-none border border-gray-200/60 dark:border-gray-700/60
                     focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20
                     transition-all duration-200"
        />
        <button
          onClick={send}
          className="p-2.5 rounded-xl bg-violet-500 hover:bg-violet-600
                     text-white transition-all duration-200
                     active:scale-95 shadow-sm hover:shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
})

export default ChatModule