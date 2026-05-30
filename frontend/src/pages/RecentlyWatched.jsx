import { useState } from 'react'
import { useAnimeList } from '../hooks/useAnimeList'
import { PageShell, AddForm, Field, AnimeCard, EmptyState, Stars } from '../components/ListUI'

export default function RecentlyWatched({ onNavigate }) {
  const { items, addItem, removeItem } = useAnimeList('yomi-recent')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', rating: '0', notes: '' })

  function handleAdd(e) {
    e.preventDefault()
    const added = addItem({
      title: form.title,
      rating: parseInt(form.rating) || 0,
      notes: form.notes.trim().slice(0, 500),
      watchedAt: new Date().toISOString(),
    })
    if (added) { setForm({ title: '', rating: '0', notes: '' }); setOpen(false) }
  }

  return (
    <PageShell
      title="Recently Watched"
      tag="Viewing History"
      color="var(--accent)"
      count={items.length}
      onAdd={() => setOpen(o => !o)}
      addOpen={open}
    >
      {open && (
        <AddForm onSubmit={handleAdd} onCancel={() => setOpen(false)} color="var(--accent)">
          <Field label="Title" required>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Neon Genesis Evangelion" autoFocus />
          </Field>
          <Field label="Rating">
            <Stars value={parseInt(form.rating)} onChange={v => setForm(f => ({ ...f, rating: String(v) }))} />
          </Field>
          <Field label="Notes">
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="What did you think?" rows={2} />
          </Field>
        </AddForm>
      )}

      {items.length === 0 && !open
        ? <EmptyState text="No completed series logged yet." onChat={onNavigate ? () => onNavigate('chat') : undefined} />
        : items.map((item, i) => (
          <AnimeCard key={item.id} item={item} onRemove={removeItem} index={i} color="var(--accent)">
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              {item.rating > 0 && <Stars value={item.rating} readOnly />}
              {item.notes && <p style={{ fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic' }}>{item.notes}</p>}
            </div>
          </AnimeCard>
        ))
      }
    </PageShell>
  )
}
