// Gradient branding panel for the left side of the auth split-card (desktop only).
export default function BrandingPanel() {
  return (
    <div className="relative hidden flex-col justify-center overflow-hidden bg-gradient-to-br from-brand-light via-brand to-brand-dark p-10 text-white md:flex">
      <h2 className="text-4xl font-extrabold leading-tight">Welcome to proNose</h2>
      <p className="mt-4 max-w-sm text-lg font-medium text-white/90">
        Connection made simple.
      </p>
      <p className="mt-1 max-w-sm text-sm text-white/80">
        Stay connected with your care team. Monitor your prosthetic with ease.
      </p>

      <ConnectionIllustration className="mt-10 w-full max-w-md self-center" />

      {/* Soft decorative blobs */}
      <span className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
      <span className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10" />
    </div>
  )
}

// Inline medical / connection themed illustration (no external asset needed).
function ConnectionIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 400 260" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* open hand holding the network */}
      <path
        d="M70 230c0-30 40-44 90-44s90 14 90 44"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* central shield */}
      <path
        d="M200 60l46 16v44c0 34-22 54-46 64-24-10-46-30-46-64V76l46-16z"
        fill="white"
        fillOpacity="0.2"
        stroke="white"
        strokeWidth="4"
      />
      <path d="M183 122l12 13 24-26" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      {/* network nodes */}
      <circle cx="300" cy="70" r="18" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="3" />
      <circle cx="330" cy="140" r="14" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="3" />
      <circle cx="95" cy="90" r="16" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="3" />
      <line x1="246" y1="92" x2="285" y2="76" stroke="white" strokeOpacity="0.5" strokeWidth="3" strokeDasharray="6 7" />
      <line x1="252" y1="118" x2="318" y2="135" stroke="white" strokeOpacity="0.5" strokeWidth="3" strokeDasharray="6 7" />
      <line x1="154" y1="100" x2="110" y2="92" stroke="white" strokeOpacity="0.5" strokeWidth="3" strokeDasharray="6 7" />
      {/* chat bubble */}
      <rect x="60" y="120" width="70" height="44" rx="14" fill="white" fillOpacity="0.22" stroke="white" strokeWidth="3" />
      <circle cx="82" cy="142" r="4" fill="white" />
      <circle cx="96" cy="142" r="4" fill="white" />
      <circle cx="110" cy="142" r="4" fill="white" />
    </svg>
  )
}
