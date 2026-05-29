export default function MessageBubble({ role, content }) {
  const isUser = role === 'user'
  return (
    <div style={{
      alignSelf: isUser ? 'flex-end' : 'flex-start',
      background: isUser ? 'var(--purple)' : 'var(--card)',
      border: isUser ? 'none' : '1px solid var(--border)',
      color: 'var(--text)',
      padding: '11px 16px',
      borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
      maxWidth: '72%',
      lineHeight: 1.6,
      whiteSpace: 'pre-wrap',
      fontSize: '14px',
      fontWeight: 300,
    }}>
      {content}
    </div>
  )
}
