import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

// Responsive shell for logged-in pages: desktop sidebar + mobile bottom nav.
// `h-screen` bounds the height so each page scrolls its own content internally
// (keeps the chat input pinned and page headers fixed).
export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <Sidebar />
      <div className="flex h-screen flex-1 flex-col overflow-hidden">
        <main className="flex min-h-0 flex-1 flex-col">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
