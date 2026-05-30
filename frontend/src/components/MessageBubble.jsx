import AnimeCards from './AnimeCards'

export default function MessageBubble({ role, content, enriched }) {
  const isUser = role === 'user'
  return (
    <div style={{
      alignSelf: isUser ? 'flex-end' : 'flex-start',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '72%',
    }}>
      <div style={{
        background: isUser ? 'var(--purple)' : 'var(--card)',
        border: isUser ? 'none' : '1px solid var(--border)',
        color: 'var(--text)',
        padding: '11px 16px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap',
        fontSize: '14px',
        fontWeight: 300,
      }}>
        {content}
      </div>
      {!isUser && enriched?.length > 0 && <AnimeCards enriched={enriched} />}
    </div>
  )
}
