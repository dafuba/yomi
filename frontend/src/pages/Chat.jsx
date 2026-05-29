import { useChat } from '../hooks/useChat'
import { useAnimeList } from '../hooks/useAnimeList'
import ChatWindow from '../components/ChatWindow'
import InputBar from '../components/InputBar'
import SuggestionCards from '../components/SuggestionCards'

const MODELS = [
  { id: 'claude-haiku-4-5-20251001', label: 'Haiku',  note: 'fast & cheap' },
  { id: 'claude-sonnet-4-5',         label: 'Sonnet', note: 'balanced' },
  { id: 'claude-opus-4-8',           label: 'Opus',   note: 'most capable' },
]

// Map list IDs returned by the backend to the right hook key + default fields
const LIST_DEFAULTS = {
  currently_watching: (title) => ({ title, currentEpisode: 1, totalEpisodes: null }),
  recently_watched:   (title) => ({ title, rating: 0, watchedAt: new Date().toISOString() }),
  watchlist:          (title) => ({ title, priority: 'medium' }),
  favourites:         (title) => ({ title, rating: 0 }),
}

const STORAGE_KEYS = {
  currently_watching: 'yomi-currently',
  recently_watched:   'yomi-recent',
  watchlist:          'yomi-watchlist',
  favourites:         'yomi-favourites',
}

export default function Chat() {
  const { messages, isLoading, error, model, setModel, suggestions, dismissSuggestion, sendMessage, clearConversation } = useChat()

  // One hook per list — each manages its own localStorage key
  const lists = {
    currently_watching: useAnimeList(STORAGE_KEYS.currently_watching),
    recently_watched:   useAnimeList(STORAGE_KEYS.recently_watched),
    watchlist:          useAnimeList(STORAGE_KEYS.watchlist),
    favourites:         useAnimeList(STORAGE_KEYS.favourites),
  }

  function handleAccept(suggestion) {
    if (suggestion.action === 'remove') {
      // Search all lists for the title and remove wherever found
      Object.values(lists).forEach(hook => hook.removeByTitle(suggestion.title))
    } else {
      const listHook = lists[suggestion.list]
      const defaults = LIST_DEFAULTS[suggestion.list]
      if (listHook && defaults) listHook.addItem(defaults(suggestion.title))
    }
    dismissSuggestion(suggestion.id)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 58px)' }}>
      {/* Sub-header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 28px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <div>
          <span style={{ fontFamily: 'var(--font-d)', fontSize: '18px', fontWeight: 400 }}>Yomi AI</span>
          <span style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: '12px', letterSpacing: '0.1em' }}>
            Anime Recommendations
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {messages.length > 0 && (
            <button
              onClick={clearConversation}
              disabled={isLoading}
              title="Clear conversation"
              style={{
                background: 'none', color: 'var(--muted)',
                border: '1px solid var(--border)', borderRadius: '8px',
                padding: '6px 12px', fontSize: '12px', cursor: 'pointer',
              }}
            >
              Clear
            </button>
          )}
          <select
            value={model}
            onChange={e => setModel(e.target.value)}
            disabled={isLoading}
            style={{
              background: 'var(--card)', color: 'var(--text)',
              border: '1px solid var(--border)', borderRadius: '8px',
              padding: '6px 12px', fontSize: '12px', cursor: 'pointer', outline: 'none',
            }}
          >
            {MODELS.map(m => <option key={m.id} value={m.id}>{m.label} — {m.note}</option>)}
          </select>
        </div>
      </div>

      <ChatWindow messages={messages} isLoading={isLoading} />

      {error && (
        <div style={{ color: 'var(--red)', padding: '8px 24px', fontSize: '13px', background: 'var(--surface)' }}>
          {error}
        </div>
      )}

      <SuggestionCards
        suggestions={suggestions}
        onAccept={handleAccept}
        onDismiss={dismissSuggestion}
      />

      <InputBar onSend={sendMessage} isLoading={isLoading} />
    </div>
  )
}
