import Navbar from './Navbar'
import BrandingPanel from './BrandingPanel'

// Page shell for auth screens: navbar + centered split-card.
// The branding panel is desktop-only; `children` is the frosted form panel.
export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-6 sm:py-10">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 shadow-shell backdrop-blur-xl md:grid-cols-2">
          <BrandingPanel />
          <div className="flex flex-col">{children}</div>
        </div>
      </main>
    </div>
  )
}
