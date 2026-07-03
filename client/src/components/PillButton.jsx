// Reusable pill-shaped button. Primary = brand fill, outline = bordered, ghost = text.
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
    primary: 'bg-brand text-white shadow-soft hover:bg-brand-dark',
    outline: 'border-2 border-brand text-brand bg-white hover:bg-brand/5',
    ghost: 'text-brand hover:bg-brand/5',
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
