import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'

export default function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div style={{
      flex: 1, overflowY: 'auto',
      display: 'flex', flexDirection: 'column',
      gap: '10px', padding: '24px 20px',
    }}>
      {messages.length === 0 && (
        <div style={{ margin: 'auto', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-d)', fontSize: '48px', fontWeight: 300, color: 'var(--border)', marginBottom: '12px' }}>
            ✦
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 300 }}>
            Tell Yomi what kind of anime you're in the mood for…
          </p>
        </div>
      )}

      {messages.map((msg, i) => (
        <MessageBubble key={i} role={msg.role} content={msg.content} enriched={msg.enriched} />
      ))}

      {isLoading && (
        <MessageBubble role="assistant" content="…" />
      )}

      <div ref={bottomRef} />
    </div>
  )
}
