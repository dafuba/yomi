import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'

const LIST_META = {
  currently_watching: { label: 'Watching',   color: 'var(--green)'  },
  recently_watched:   { label: 'History',    color: 'var(--accent)' },
  watchlist:          { label: 'Watchlist',  color: 'var(--orange)' },
  favourites:         { label: 'Favourites', color: 'var(--pink)'   },
}

export default function ChatWindow({ messages, isLoading, suggestions = [], onAccept, onDismiss }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading, suggestions])

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

      {/* Inline suggestion chips — appear below the last message in the scroll area */}
      {suggestions.length > 0 && (
        <div className="fade-in" style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '80%' }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Yomi noticed
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {suggestions.map(s => {
              const meta = LIST_META[s.list] ?? { label: s.list, color: 'var(--muted)' }
              const isRemove = s.action === 'remove'
              const chipColor = isRemove ? 'var(--red)' : meta.color
              const label = isRemove
                ? `✕ Remove from ${meta.label}`
                : `+ ${s.title} → ${meta.label}`
              return (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <button
                    onClick={() => onAccept(s)}
                    style={{
                      background: chipColor + '18',
                      border: `1px solid ${chipColor}55`,
                      borderRadius: '20px',
                      padding: '5px 13px',
                      fontSize: '12px', color: chipColor,
                      cursor: 'pointer', fontFamily: 'var(--font-ui)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {label}
                  </button>
                  <button
                    onClick={() => onDismiss(s.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--muted)', fontSize: '15px', padding: '0 2px',
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
