import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

// Responsive shell for logged-in pages: desktop sidebar + mobile bottom nav.
// The whole app floats as a frosted-glass panel over the pastel gradient,
// with a faint stacked-card echo underneath (desktop only).
// `h-screen` bounds the height so each page scrolls its own content internally
// (keeps the chat input pinned and page headers fixed).
export default function AppLayout() {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden md:px-8 md:pb-9 md:pt-7">
      <div className="glass-shell relative z-10 flex min-h-0 flex-1 overflow-hidden md:rounded-[2.25rem]">
        <Sidebar />
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
          <main className="flex min-h-0 flex-1 flex-col">
            <Outlet />
          </main>
          <BottomNav />
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-1/2 hidden h-9 w-[88%] -translate-x-1/2 rounded-[1.75rem] bg-white/30 md:block" />
    </div>
  )
}
