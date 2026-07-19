// Reusable pill-shaped button. Primary = teal gradient fill, outline = frosted
// bordered, ghost = text only.
export default function PillButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100'

  const variants = {
    primary:
      'bg-gradient-to-br from-brand to-brand-dark text-white shadow-soft hover:from-brand-dark hover:to-brand-deep',
    outline:
      'border-2 border-brand-dark/40 bg-white/60 text-brand-dark backdrop-blur hover:bg-white/90',
    ghost: 'text-brand-dark hover:bg-white/50',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
