import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL
const DEFAULT_MODEL = 'claude-haiku-4-5-20251001'
const STORAGE_KEY = 'yomi-chat-history'
// Full history is stored and displayed; only the last N messages are sent to the API.
// This bounds token cost for long conversations while keeping recent context intact.
const MAX_CONTEXT_MESSAGES = 20

function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useChat() {
  const [messages, setMessages] = useState(loadMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [model, setModel] = useState(DEFAULT_MODEL)
  const [suggestions, setSuggestions] = useState([])

  // Persist conversation whenever messages change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  async function sendMessage(userText) {
    if (!userText.trim()) return

    const userMessage = { role: 'user', content: userText }
    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setSuggestions([])
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.slice(-MAX_CONTEXT_MESSAGES).map(m => ({ role: m.role, content: m.content })),
          model,
        }),
      })

      if (!response.ok) throw new Error(`Server error: ${response.status}`)

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, enriched: data.enriched ?? [] }])
      setSuggestions(data.suggestions ?? [])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  function dismissSuggestion(id) {
    setSuggestions(prev => prev.filter(s => s.id !== id))
  }

  function clearConversation() {
    setMessages([])
    setSuggestions([])
    setError(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return { messages, isLoading, error, model, setModel, suggestions, dismissSuggestion, sendMessage, clearConversation }
}
