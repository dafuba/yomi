import { useState } from 'react'
import { useAnimeList } from '../hooks/useAnimeList'
import { PageShell, AddForm, Field, AnimeCard, EmptyState } from '../components/ListUI'

export default function CurrentlyWatching({ onNavigate }) {
  const { items, addItem, removeItem, updateItem } = useAnimeList('yomi-currently')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', total: '', current: '1' })

  function handleAdd(e) {
    e.preventDefault()
    const added = addItem({
      title: form.title,
      currentEpisode: Math.max(1, parseInt(form.current) || 1),
      totalEpisodes: parseInt(form.total) || null,
    })
    if (added) { setForm({ title: '', total: '', current: '1' }); setOpen(false) }
  }

  function increment(id, item) {
    const next = (item.currentEpisode || 1) + 1
    if (item.totalEpisodes && next > item.totalEpisodes) return
    updateItem(id, { currentEpisode: next })
  }

  return (
    <PageShell
      title="Currently Watching"
      tag="In Progress"
      color="var(--green)"
      count={items.length}
      onAdd={() => setOpen(o => !o)}
      addOpen={open}
    >
      {open && (
        <AddForm onSubmit={handleAdd} onCancel={() => setOpen(false)} color="var(--green)">
          <Field label="Title" required>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Vinland Saga" autoFocus />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Current episode">
              <input type="number" min="1" value={form.current} onChange={e => setForm(f => ({ ...f, current: e.target.value }))} />
            </Field>
            <Field label="Total episodes">
              <input type="number" min="1" value={form.total} onChange={e => setForm(f => ({ ...f, total: e.target.value }))} placeholder="unknown" />
            </Field>
          </div>
        </AddForm>
      )}

      {items.length === 0 && !open
        ? <EmptyState text="Nothing in progress yet. Start tracking a series." onChat={onNavigate ? () => onNavigate('chat') : undefined} />
        : items.map((item, i) => (
          <AnimeCard key={item.id} item={item} onRemove={removeItem} index={i} color="var(--green)">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
                Ep {item.currentEpisode}{item.totalEpisodes ? ` / ${item.totalEpisodes}` : ''}
              </span>
              {item.totalEpisodes && (
                <div style={{ flex: 1, height: '3px', background: 'var(--border)', borderRadius: '2px' }}>
                  <div style={{
                    height: '100%', borderRadius: '2px', background: 'var(--green)',
                    width: `${Math.min(100, (item.currentEpisode / item.totalEpisodes) * 100)}%`,
                    transition: 'width 0.3s',
                  }} />
                </div>
              )}
              <button onClick={() => increment(item.id, item)} style={{
                background: 'var(--green)', color: '#000', border: 'none',
                borderRadius: '6px', padding: '4px 10px', fontSize: '12px',
                cursor: 'pointer', fontWeight: 500,
              }}>
                +1 ep
              </button>
            </div>
          </AnimeCard>
        ))
      }
    </PageShell>
  )
}
