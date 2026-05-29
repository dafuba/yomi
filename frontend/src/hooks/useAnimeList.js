import { useState, useEffect } from 'react'

// Persists a named list to localStorage. Safe: uses JSON only, never eval.
export function useAnimeList(storageKey) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items))
  }, [items, storageKey])

  function addItem(fields) {
    const title = String(fields.title ?? '').trim().slice(0, 200)
    if (!title) return null
    const entry = { id: Date.now().toString(), addedAt: new Date().toISOString(), ...fields, title }
    setItems(prev => [entry, ...prev])
    return entry
  }

  function removeItem(id) {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  // Used by Yomi's remove suggestions — matches case-insensitively by title.
  // Returns true if anything was removed.
  function removeByTitle(title) {
    const lower = title.toLowerCase()
    let removed = false
    setItems(prev => {
      const next = prev.filter(item => item.title.toLowerCase() !== lower)
      removed = next.length !== prev.length
      return next
    })
    return removed
  }

  function updateItem(id, updates) {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item))
  }

  return { items, addItem, removeItem, removeByTitle, updateItem }
}
