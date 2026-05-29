import { useState } from 'react'

const FEATURES = [
  {
    id: 'chat',
    symbol: '✦',
    title: 'Yomi AI',
    tag: 'Recommendation Chat',
    description: 'Describe your mood and Yomi finds anime that genuinely fit — like asking a friend who has watched everything.',
    color: '#6c63ff',
  },
  {
    id: 'currently',
    symbol: '▶',
    title: 'Currently Watching',
    tag: 'In Progress',
    description: 'Log your active series and track episode progress so you never lose your place.',
    color: '#3ecf8e',
  },
  {
    id: 'recent',
    symbol: '◷',
    title: 'Recently Watched',
    tag: 'Viewing History',
    description: 'Record completed series, leave ratings and notes, and look back on your journey.',
    color: '#c9a84c',
  },
  {
    id: 'watchlist',
    symbol: '◈',
    title: 'Watch Later',
    tag: 'Your Queue',
    description: 'Bookmark anime you plan to watch and set priorities so the best ones rise to the top.',
    color: '#ff7c6e',
  },
  {
    id: 'favourites',
    symbol: '◆',
    title: 'Favourites',
    tag: 'All-Time Greats',
    description: 'Collect the anime that left a mark. Your personal hall of fame.',
    color: '#ff6fb7',
  },
]

function FeatureCard({ feature, onClick, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      className="fade-up"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        animationDelay: `${index * 0.07}s`,
        background: hovered ? 'var(--card-h)' : 'var(--card)',
        border: `1px solid ${hovered ? feature.color + '55' : 'var(--border)'}`,
        borderRadius: '16px',
        padding: '32px 28px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.22s cubic-bezier(0.22,1,0.36,1)',
        transform: hovered ? 'translateY(-5px)' : 'none',
        boxShadow: hovered ? `0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px ${feature.color}22` : 'none',
      }}
    >
      <div style={{ fontSize: '22px', color: feature.color, marginBottom: '20px', lineHeight: 1 }}>
        {feature.symbol}
      </div>
      <div style={{ fontFamily: 'var(--font-d)', fontSize: '26px', fontWeight: 400, color: 'var(--text)', lineHeight: 1, marginBottom: '6px' }}>
        {feature.title}
      </div>
      <div style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: feature.color, fontWeight: 500, marginBottom: '16px' }}>
        {feature.tag}
      </div>
      <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.65, fontWeight: 300 }}>
        {feature.description}
      </p>
      <div style={{
        marginTop: '24px', fontSize: '12px', color: hovered ? feature.color : 'var(--muted)',
        letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px',
        transition: 'color 0.2s',
      }}>
        Open {hovered ? '→' : '·'}
      </div>
    </button>
  )
}

export default function Home({ onNavigate }) {
  return (
    <div style={{ padding: '72px 40px 80px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero */}
      <div className="fade-up" style={{ textAlign: 'center', marginBottom: '80px' }}>
        <p style={{
          fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.35em',
          color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500,
        }}>
          Your Anime Companion
        </p>
        <h1 style={{
          fontFamily: 'var(--font-d)',
          fontSize: 'clamp(72px, 12vw, 140px)',
          fontWeight: 300,
          letterSpacing: '0.06em',
          color: 'var(--text)',
          lineHeight: 0.9,
          marginBottom: '28px',
        }}>
          YOMI
        </h1>
        <p style={{
          fontSize: '15px', color: 'var(--muted)', fontWeight: 300,
          maxWidth: '380px', margin: '0 auto', lineHeight: 1.7,
        }}>
          Track, discover, and organise your anime universe in one elegant space.
        </p>
      </div>

      {/* Feature grid — first card wide, others fill */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
      }}>
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.id} feature={f} onClick={() => onNavigate(f.id)} index={i} />
        ))}
      </div>
    </div>
  )
}
