import { useState } from 'react'
import { useAnimeList } from '../hooks/useAnimeList'
import { PageShell, AddForm, Field, AnimeCard, EmptyState, Stars } from '../components/ListUI'

export default function Favourites({ onNavigate }) {
  const { items, addItem, removeItem } = useAnimeList('yomi-favourites')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', rating: '5', notes: '' })

  function handleAdd(e) {
    e.preventDefault()
    const added = addItem({
      title: form.title,
      rating: parseInt(form.rating) || 5,
      notes: form.notes.trim().slice(0, 500),
    })
    if (added) { setForm({ title: '', rating: '5', notes: '' }); setOpen(false) }
  }

  return (
    <PageShell
      title="Favourites"
      tag="All-Time Greats"
      color="var(--pink)"
      count={items.length}
      onAdd={() => setOpen(o => !o)}
      addOpen={open}
      onChat={onNavigate ? () => onNavigate('chat') : undefined}
      lastAdded={items[0]?.addedAt}
    >
      {open && (
        <AddForm onSubmit={handleAdd} onCancel={() => setOpen(false)} color="var(--pink)">
          <Field label="Title" required>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Fullmetal Alchemist: Brotherhood" autoFocus />
          </Field>
          <Field label="Rating">
            <Stars value={parseInt(form.rating)} onChange={v => setForm(f => ({ ...f, rating: String(v) }))} />
          </Field>
          <Field label="Why it's a favourite">
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="What makes it special…" rows={2} />
          </Field>
        </AddForm>
      )}

      {items.length === 0 && !open
        ? <EmptyState text="No favourites yet. Add the anime that left a mark." onChat={onNavigate ? () => onNavigate('chat') : undefined} />
        : items.map((item, i) => (
          <AnimeCard key={item.id} item={item} onRemove={removeItem} index={i} color="var(--pink)">
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {item.rating > 0 && <Stars value={item.rating} readOnly color="var(--pink)" />}
              {item.notes && <p style={{ fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic' }}>{item.notes}</p>}
            </div>
          </AnimeCard>
        ))
      }
    </PageShell>
  )
}
