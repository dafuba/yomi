import { useState } from 'react'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Chat from './pages/Chat'
import CurrentlyWatching from './pages/CurrentlyWatching'
import RecentlyWatched from './pages/RecentlyWatched'
import Watchlist from './pages/Watchlist'
import Favourites from './pages/Favourites'

const PAGES = { home: Home, chat: Chat, currently: CurrentlyWatching, recent: RecentlyWatched, watchlist: Watchlist, favourites: Favourites }

export default function App() {
  const [page, setPage] = useState('home')
  const Page = PAGES[page] || Home

  return (
    <>
      <NavBar currentPage={page} onNavigate={setPage} />
      <main style={{ flex: 1 }}>
        <Page onNavigate={setPage} />
      </main>
    </>
  )
}
