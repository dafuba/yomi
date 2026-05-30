export default function AnimeCards({ enriched }) {
  const cards = enriched.filter(Boolean)
  if (!cards.length) return null

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginTop: '10px',
      maxWidth: '72%',
      alignSelf: 'flex-start',
    }}>
      {cards.map(anime => (
        <a
          key={anime.mal_id}
          href={anime.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div style={{
            display: 'flex',
            gap: '10px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '8px',
            width: '220px',
            cursor: 'pointer',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--purple)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            {anime.image_url && (
              <img
                src={anime.image_url}
                alt={anime.title}
                style={{
                  width: '52px',
                  height: '74px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  flexShrink: 0,
                }}
              />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--text)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {anime.title_english || anime.title}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                {anime.score != null && (
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                    ★ {anime.score.toFixed(1)}
                  </span>
                )}
                {anime.episodes != null && (
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                    {anime.episodes} eps
                  </span>
                )}
                {anime.year != null && (
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                    {anime.year}
                  </span>
                )}
              </div>
              <span style={{ fontSize: '10px', color: 'var(--purple)', marginTop: 'auto' }}>
                MAL ↗
              </span>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}
