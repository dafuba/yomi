const LIST_META = {
  currently_watching: { label: 'Currently Watching', color: 'var(--green)',  symbol: '▶' },
  recently_watched:   { label: 'Recently Watched',   color: 'var(--accent)', symbol: '◷' },
  watchlist:          { label: 'Watch Later',         color: 'var(--orange)', symbol: '◈' },
  favourites:         { label: 'Favourites',          color: 'var(--pink)',   symbol: '◆' },
}

export default function SuggestionCards({ suggestions, onAccept, onDismiss }) {
  if (!suggestions.length) return null

  return (
    <div style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--surface)',
      padding: '12px 20px 14px',
      display: 'flex', flexDirection: 'column', gap: '8px',
    }}>
      <p style={{
        fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'var(--muted)', marginBottom: '2px', fontWeight: 500,
      }}>
        Yomi noticed
      </p>

      {suggestions.map(s => {
        const meta = LIST_META[s.list] ?? { label: s.list, color: 'var(--muted)', symbol: '·' }
        const isRemove = s.action === 'remove'
        const actionColor = isRemove ? 'var(--red)' : meta.color

        return (
          <div key={s.id} className="fade-up" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'var(--card)',
            border: `1px solid ${actionColor}44`,
            borderRadius: '10px',
            padding: '10px 14px',
          }}>
            <span style={{ color: actionColor, fontSize: '13px', flexShrink: 0 }}>
              {isRemove ? '✕' : meta.symbol}
            </span>

            <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-d)', fontSize: '17px', color: 'var(--text)', whiteSpace: 'nowrap' }}>
                {s.title}
              </span>
              <span style={{ fontSize: '12px', color: actionColor, whiteSpace: 'nowrap' }}>
                {isRemove ? `remove from ${meta.label}` : `→ ${meta.label}`}
              </span>
              {s.reason && (
                <span style={{ fontSize: '12px', color: 'var(--muted)', fontStyle: 'italic' }}>
                  · {s.reason}
                </span>
              )}
            </div>

            <button onClick={() => onAccept(s)} style={{
              flexShrink: 0,
              background: isRemove ? 'transparent' : meta.color,
              color: isRemove ? 'var(--red)' : '#000',
              border: isRemove ? '1px solid var(--red)' : 'none',
              borderRadius: '6px', padding: '5px 14px',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            }}>
              {isRemove ? 'Remove' : 'Add'}
            </button>
            <button onClick={() => onDismiss(s.id)} style={{
              flexShrink: 0,
              background: 'none', color: 'var(--muted)', border: 'none',
              cursor: 'pointer', fontSize: '18px', padding: '0 2px', lineHeight: 1,
            }}>
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}
