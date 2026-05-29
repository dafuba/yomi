import { useState } from 'react'

export default function InputBar({ onSend, isLoading }) {
  const [text, setText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim() || isLoading) return
    onSend(text)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex', gap: '10px',
      padding: '14px 20px',
      borderTop: '1px solid var(--border)',
      background: 'var(--surface)',
    }}>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="e.g. something slow and melancholic…"
        disabled={isLoading}
        style={{
          flex: 1, background: 'var(--card)',
          border: '1px solid var(--border)', borderRadius: '24px',
          padding: '11px 18px', color: 'var(--text)', fontSize: '14px',
          outline: 'none', fontWeight: 300,
        }}
      />
      <button type="submit" disabled={isLoading} style={{
        background: isLoading ? 'var(--card)' : 'var(--purple)',
        color: isLoading ? 'var(--muted)' : '#fff',
        border: 'none', borderRadius: '24px',
        padding: '11px 22px', fontSize: '13px',
        fontWeight: 500, cursor: isLoading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s', letterSpacing: '0.03em',
      }}>
        {isLoading ? '…' : 'Send'}
      </button>
    </form>
  )
}
