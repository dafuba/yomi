const NAV = [
  { id: 'chat',      label: 'Yomi AI',    dot: '#6c63ff' },
  { id: 'currently', label: 'Watching',   dot: '#3ecf8e' },
  { id: 'recent',    label: 'History',    dot: '#c9a84c' },
  { id: 'watchlist', label: 'Watchlist',  dot: '#ff7c6e' },
  { id: 'favourites',label: 'Favourites', dot: '#ff6fb7' },
]

export default function NavBar({ currentPage, onNavigate }) {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(7,7,16,0.88)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #1c1c3a',
      display: 'flex', alignItems: 'center',
      padding: '0 32px', height: '58px', gap: '8px',
    }}>
      <button onClick={() => onNavigate('home')} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontFamily: 'var(--font-d)', fontSize: '20px', fontWeight: 600,
        color: 'var(--accent)', letterSpacing: '0.2em',
        padding: '0 24px 0 0', marginRight: '8px',
        borderRight: '1px solid var(--border)',
      }}>
        YOMI
      </button>

      {NAV.map(item => {
        const active = currentPage === item.id
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              background: active ? 'rgba(255,255,255,0.04)' : 'none',
              border: 'none', cursor: 'pointer',
              padding: '6px 14px', borderRadius: '8px',
              fontSize: '13px', fontWeight: active ? 500 : 400,
              color: active ? item.dot : 'var(--muted)',
              letterSpacing: '0.03em',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'color 0.15s, background 0.15s',
            }}
          >
            <span style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: active ? item.dot : 'var(--border)',
              flexShrink: 0, transition: 'background 0.15s',
            }} />
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
