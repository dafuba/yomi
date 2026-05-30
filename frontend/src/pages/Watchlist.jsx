import { useState } from 'react'
import { useAnimeList } from '../hooks/useAnimeList'
import { PageShell, AddForm, Field, AnimeCard, EmptyState } from '../components/ListUI'

const PRIORITIES = [
  { value: 'high',   label: 'High',   color: '#ff7c6e' },
  { value: 'medium', label: 'Medium', color: '#c9a84c' },
  { value: 'low',    label: 'Low',    color: '#55556e' },
]

export default function Watchlist({ onNavigate }) {
  const { items, addItem, removeItem } = useAnimeList('yomi-watchlist')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', priority: 'medium', notes: '' })

  function handleAdd(e) {
    e.preventDefault()
    const added = addItem({ title: form.title, priority: form.priority, notes: form.notes.trim().slice(0, 300) })
    if (added) { setForm({ title: '', priority: 'medium', notes: '' }); setOpen(false) }
  }

  const priorityColor = p => PRIORITIES.find(x => x.value === p)?.color ?? 'var(--muted)'

  return (
    <PageShell
      title="Watch Later"
      tag="Your Queue"
      color="var(--orange)"
      count={items.length}
      onAdd={() => setOpen(o => !o)}
      addOpen={open}
    >
      {open && (
        <AddForm onSubmit={handleAdd} onCancel={() => setOpen(false)} color="var(--orange)">
          <Field label="Title" required>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Mob Psycho 100" autoFocus />
          </Field>
          <Field label="Priority">
            <div style={{ display: 'flex', gap: '8px' }}>
              {PRIORITIES.map(p => (
                <button key={p.value} type="button" onClick={() => setForm(f => ({ ...f, priority: p.value }))} style={{
                  padding: '6px 14px', borderRadius: '20px', border: `1px solid ${form.priority === p.value ? p.color : 'var(--border)'}`,
                  background: form.priority === p.value ? p.color + '22' : 'none',
                  color: form.priority === p.value ? p.color : 'var(--muted)',
                  fontSize: '13px', cursor: 'pointer',
                }}>
                  {p.label}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Notes">
            <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Why you want to watch it…" />
          </Field>
        </AddForm>
      )}

      {items.length === 0 && !open
        ? <EmptyState text="Your watchlist is empty. Add something to look forward to." onChat={onNavigate ? () => onNavigate('chat') : undefined} />
        : items.map((item, i) => (
          <AnimeCard key={item.id} item={item} onRemove={removeItem} index={i} color="var(--orange)">
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{
                fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
                border: `1px solid ${priorityColor(item.priority)}`,
                color: priorityColor(item.priority), letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                {item.priority}
              </span>
              {item.notes && <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{item.notes}</span>}
            </div>
          </AnimeCard>
        ))
      }
    </PageShell>
  )
}
