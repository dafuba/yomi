// Shared building blocks used by all four list pages.
import React, { useState } from 'react'

const CHAT_CTAS = [
  "not sure what to watch? ask Yomi →",
  "ask Yomi what to watch tonight →",
  "let Yomi find you something good →",
  "tell Yomi what you're in the mood for →",
  "find your next obsession →",
]

export function PageShell({ title, tag, color, count, onAdd, addOpen, onChat, lastAdded, children }) {
  const [cta] = useState(() => CHAT_CTAS[Math.floor(Math.random() * CHAT_CTAS.length)])

  const formattedLastAdded = lastAdded
    ? new Date(lastAdded).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <div className="list-shell">
      <div className="fade-up" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '36px' }}>
        <div>
          <p style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color, marginBottom: '8px', fontWeight: 500 }}>
            {tag}
          </p>
          <h1 style={{ fontFamily: 'var(--font-d)', fontSize: '40px', fontWeight: 300, lineHeight: 1, display: 'flex', alignItems: 'center', gap: '14px' }}>
            {title}
            {count > 0 && (
              <span style={{ fontSize: '14px', fontFamily: 'var(--font-ui)', color: 'var(--muted)', fontWeight: 400, letterSpacing: 0 }}>
                {count}
              </span>
            )}
          </h1>
        </div>
        <button onClick={onAdd} style={{
          background: addOpen ? 'var(--card)' : color,
          color: addOpen ? 'var(--muted)' : '#000',
          border: addOpen ? '1px solid var(--border)' : 'none',
          borderRadius: '10px', padding: '10px 20px',
          fontSize: '13px', fontWeight: 500, cursor: 'pointer',
          transition: 'all 0.2s', letterSpacing: '0.03em',
        }}>
          {addOpen ? 'Cancel' : '+ Add'}
        </button>
      </div>

      <div className="list-body">
        <div className="list-items">
          {children}
        </div>

        <aside className="list-sidebar">
          {count > 0 && (
            <div>
              <div style={{ fontSize: '48px', fontFamily: 'var(--font-d)', color, lineHeight: 1, fontWeight: 300 }}>
                {count}
              </div>
              <div style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '6px' }}>
                anime
              </div>
            </div>
          )}

          {count > 0 && <div style={{ height: '1px', background: 'var(--border)' }} />}

          {formattedLastAdded && (
            <div>
              <div style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '5px' }}>
                Last added
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text)' }}>{formattedLastAdded}</div>
            </div>
          )}

          {onChat && (
            <>
              {count > 0 && <div style={{ height: '1px', background: 'var(--border)' }} />}
              <button
                onClick={onChat}
                style={{
                  background: 'none',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '11px 14px',
                  color: 'var(--purple)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  lineHeight: 1.4,
                  transition: 'border-color 0.15s, color 0.15s',
                }}
              >
                {cta}
              </button>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}

export function AddForm({ onSubmit, onCancel, color, children }) {
  return (
    <form onSubmit={onSubmit} className="fade-in" style={{
      background: 'var(--card)',
      border: `1px solid ${color}44`,
      borderRadius: '14px',
      padding: '24px',
      display: 'flex', flexDirection: 'column', gap: '16px',
      marginBottom: '8px',
    }}>
      {children}
      <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
        <button type="submit" style={{
          background: color, color: '#000', border: 'none',
          borderRadius: '8px', padding: '9px 20px',
          fontSize: '13px', fontWeight: 600, cursor: 'pointer',
        }}>
          Save
        </button>
        <button type="button" onClick={onCancel} style={{
          background: 'none', color: 'var(--muted)', border: '1px solid var(--border)',
          borderRadius: '8px', padding: '9px 16px', fontSize: '13px', cursor: 'pointer',
        }}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export function Field({ label, required, children }) {
  const inputStyle = {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '9px 12px',
    color: 'var(--text)', fontSize: '14px', width: '100%', outline: 'none',
    resize: 'vertical',
  }
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <span style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 500 }}>
        {label}{required && ' *'}
      </span>
      {React.cloneElement(children, {
        style: { ...inputStyle, ...(children.props.style || {}) }
      })}
    </label>
  )
}

export function AnimeCard({ item, onRemove, index, color, children }) {
  const [hovered, setHovered] = useState(false)
  const date = item.addedAt
    ? new Date(item.addedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''
  const hasMeta = item.score != null || item.episodes != null || item.year != null
  const displayTitle = item.title_english || item.title

  return (
    <div
      className="fade-up"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        animationDelay: `${index * 0.04}s`,
        background: hovered ? 'var(--card-h)' : 'var(--card)',
        border: `1px solid ${hovered ? color + '44' : 'var(--border)'}`,
        borderRadius: '12px',
        padding: item.image_url ? '14px 18px' : '18px 20px',
        transition: 'all 0.18s',
        display: 'flex',
        gap: '14px',
      }}
    >
      {/* Poster thumbnail — only present when Jikan data was stored with this item */}
      {item.image_url && (
        item.url
          ? <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0, lineHeight: 0, alignSelf: 'flex-start' }}>
              <img src={item.image_url} alt={displayTitle} style={{ width: '52px', height: '74px', objectFit: 'cover', borderRadius: '6px' }} />
            </a>
          : <img src={item.image_url} alt={displayTitle} style={{ width: '52px', height: '74px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0, alignSelf: 'flex-start' }} />
      )}

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ minWidth: 0, paddingRight: '8px' }}>
            <div style={{
              fontFamily: 'var(--font-d)', fontSize: '20px', fontWeight: 400,
              color: 'var(--text)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {displayTitle}
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '3px', flexWrap: 'wrap' }}>
              {hasMeta ? (
                <>
                  {item.score != null && (
                    <span style={{ fontSize: '11px', color: 'var(--muted)' }}>★ {Number(item.score).toFixed(1)}</span>
                  )}
                  {item.episodes != null && (
                    <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{item.episodes} eps</span>
                  )}
                  {item.year != null && (
                    <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{item.year}</span>
                  )}
                </>
              ) : (
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{date}</span>
              )}
            </div>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--muted)', fontSize: '16px', padding: '0 4px',
              opacity: hovered ? 1 : 0, transition: 'opacity 0.15s',
              lineHeight: 1, flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function EmptyState({ text, onChat }) {
  return (
    <div className="fade-in" style={{
      textAlign: 'center', padding: '64px 0',
      color: 'var(--muted)', fontSize: '14px', fontWeight: 300,
    }}>
      <p>{text}</p>
      {onChat && (
        <button onClick={onChat} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--purple)', fontSize: '13px',
          fontFamily: 'var(--font-ui)', display: 'block',
          margin: '12px auto 0',
        }}>
          Chat with Yomi AI →
        </button>
      )}
    </div>
  )
}

export function Stars({ value = 0, onChange, readOnly = false, color = 'var(--accent)' }) {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => !readOnly && onChange?.(n)}
          style={{
            background: 'none', border: 'none', padding: '0',
            fontSize: '18px', cursor: readOnly ? 'default' : 'pointer',
            color: n <= value ? color : 'var(--border)',
            transition: 'color 0.1s',
          }}
        >
          ★
        </button>
      ))}
    </div>
  )
}
